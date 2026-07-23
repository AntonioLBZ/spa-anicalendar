import { getNextAiringByAnilistIds, getNextAiringByMalIds } from '../../shared';
import { kitsuFetch } from '../client';
import { selectAnimeEntries } from './media-list.selector';

import type { DenormalizedEntry } from './media-list.selector';
import type {
    GetCandidateAnimeIdsParams,
    KitsuAnimeResource,
    KitsuCandidateAnimeResponse,
    KitsuCategory,
    KitsuLibraryEntriesResponse,
    KitsuMapping,
} from './media-list.types';
import type { AnimeEntry, MediaFormat, MediaListEntryStatus, User } from '@/services/models';

// Reverse of media-list.selector.ts's FORMAT_MAP — our MediaFormat back to Kitsu's own subtype
// enum. TV_SHORT has no Kitsu equivalent, so it's intentionally omitted (never matches anything).
const FORMAT_TO_KITSU_SUBTYPE: Partial<Record<MediaFormat, string>> = {
    TV: 'TV',
    MOVIE: 'movie',
    OVA: 'OVA',
    ONA: 'ONA',
    SPECIAL: 'special',
    MUSIC: 'music',
};

const SEASON_TO_KITSU: Record<string, string> = {
    WINTER: 'winter',
    SPRING: 'spring',
    SUMMER: 'summer',
    FALL: 'fall',
};

function getExternalIdForAnime(
    anime: KitsuAnimeResource,
    mappingById: Map<string, KitsuMapping>,
    externalSite: string,
): number | undefined {
    const refs = anime.relationships?.mappings?.data ?? [];

    const mapping = refs
        .map((ref) => mappingById.get(ref.id))
        .find((mapping): mapping is KitsuMapping => mapping?.attributes.externalSite === externalSite);

    return mapping ? Number(mapping.attributes.externalId) : undefined;
}

// Kitsu's library-entries endpoint caps page[limit] at 20 — a real "planning" backlog (hundreds
// of entries) needs to be paged through via the JSON:API `links.next` URL, or entries silently go
// missing past the first page (the same class of bug already fixed for AniList). Cap the loop as
// a safety net against a runaway/misbehaving API.
const PAGE_LIMIT = 20;
const MAX_PAGES = 40; // 40 * 20 = 800, comfortably above any real user's list size

async function getMediaList(
    user: User,
    statuses: MediaListEntryStatus[] = ['WATCHING'],
    animeIdIn?: number[],
): Promise<AnimeEntry[]> {
    // A `planning` list can be enormous with almost none of it relevant to a weekly calendar —
    // when the caller already narrowed the request to a bounded candidate set (see
    // getCandidateAnimeIds below), skip the request entirely if that set is empty, rather than
    // issuing a query Kitsu would answer with zero results anyway.
    if (animeIdIn && animeIdIn.length === 0) {
        return [];
    }

    const kitsuStatusMap: Record<MediaListEntryStatus, string> = {
        WATCHING: 'current',
        PLANNING: 'planned',
    };

    const kitsuStatuses = statuses.map((s) => kitsuStatusMap[s]).join(',');
    const animeIdFilter = animeIdIn ? `&filter[anime_id]=${animeIdIn.join(',')}` : '';

    const data: KitsuLibraryEntriesResponse['data'] = [];
    const included: NonNullable<KitsuLibraryEntriesResponse['included']> = [];
    let nextUrl: string | undefined =
        `/library-entries?filter[user_id]=${user.id}&filter[kind]=anime&filter[status]=${kitsuStatuses}${animeIdFilter}&include=anime,anime.mappings,anime.categories&page[limit]=${PAGE_LIMIT}`;
    let page = 0;

    while (nextUrl && page < MAX_PAGES) {
        const response: KitsuLibraryEntriesResponse = await kitsuFetch<KitsuLibraryEntriesResponse>(nextUrl);

        data.push(...response.data);
        included.push(...(response.included ?? []));
        nextUrl = response.links?.next;
        page += 1;
    }

    const animeById = new Map(included.filter((r): r is KitsuAnimeResource => r.type === 'anime').map((r) => [r.id, r]));
    const mappingById = new Map(included.filter((r): r is KitsuMapping => r.type === 'mappings').map((r) => [r.id, r]));
    const categoryById = new Map(included.filter((r): r is KitsuCategory => r.type === 'categories').map((r) => [r.id, r]));

    const denormalized: DenormalizedEntry[] = data.flatMap((entry) => {
        const anime = animeById.get(entry.relationships.anime.data.id);
        if (!anime) {
            return [];
        }

        const categories = (anime.relationships?.categories?.data ?? [])
            .map((ref) => categoryById.get(ref.id))
            .filter((category): category is KitsuCategory => category !== undefined);

        const malId = getExternalIdForAnime(anime, mappingById, 'myanimelist/anime');

        return [{ entry, anime, categories, malId }];
    });

    // Build lookup maps from ALL denormalized entries (not just currently-airing), so season/seasonYear
    // backfill covers FINISHED and PLANNING entries too. Keep nextAiringEpisode sourced separately.
    // Now that Kitsu's list is paginated in full, these id sets can comfortably exceed AniList's
    // Page.perPage cap of 50 — getNextAiringByMalIds/getNextAiringByAnilistIds chunk internally.
    const malIds = denormalized.map(({ malId }) => malId).filter((malId): malId is number => malId !== undefined);

    // Kitsu's crowdsourced MAL crossreference is frequently missing for newer/niche titles even
    // though the show is actively airing and Kitsu already has an AniList crossreference for it —
    // fall back to looking the airing schedule up by AniList id instead of dropping the show.
    const anilistIdByAnimeId = new Map(
        denormalized
            .filter(({ malId }) => malId === undefined)
            .map(({ anime }) => [anime.id, getExternalIdForAnime(anime, mappingById, 'anilist/anime')] as const)
            .filter((pair): pair is [string, number] => pair[1] !== undefined),
    );

    const [nextAiringByMalId, nextAiringByAnilistId] = await Promise.all([
        getNextAiringByMalIds(malIds),
        getNextAiringByAnilistIds([...anilistIdByAnimeId.values()]),
    ]);

    const entries = selectAnimeEntries(denormalized, nextAiringByMalId, nextAiringByAnilistId, anilistIdByAnimeId);

    // Merge backfilled season/seasonYear from AniList lookup, but keep nextAiringEpisode from currentlyAiring only
    const currentlyAiring = denormalized.filter(({ anime }) => anime.attributes.status === 'current');
    const currentlyAiringIds = new Set(currentlyAiring.map(({ anime }) => anime.id));

    return entries.map((item, index) => {
        const isCurrentlyAiring = currentlyAiringIds.has(denormalized[index].anime.id);

        // Keep nextAiringEpisode only if currently airing
        if (!isCurrentlyAiring && item.nextAiringEpisode) {
            return { ...item, nextAiringEpisode: undefined };
        }

        // Fallback nextAiringEpisode to AniList if not already set
        if (!item.nextAiringEpisode && isCurrentlyAiring) {
            const anilistId = anilistIdByAnimeId.get(denormalized[index].anime.id);
            const fallbackAiring = anilistId !== undefined ? nextAiringByAnilistId[anilistId]?.nextAiringEpisode : undefined;
            if (fallbackAiring) {
                return { ...item, nextAiringEpisode: fallbackAiring };
            }
        }

        return item;
    });
}

// Lightweight id-only lookup against Kitsu's public anime catalog (/anime), which DOES support
// season/seasonYear/status/subtype filtering server-side (unlike /library-entries, which has no
// such filter on the underlying anime — confirmed live: filter[season]/filter[seasonYear]/
// filter[status]/filter[subtype] all work on /anime). Used to build a bounded filter[anime_id]
// candidate set for the "planning" fetch (confirmed live: /library-entries accepts
// filter[anime_id]=id1,id2,... to scope the user's own list), instead of paging through an entire,
// potentially huge planning backlog. Kitsu's own page[limit] cap is 20 (confirmed live: values
// above 20 return 400), so this is capped at CANDIDATE_MAX_PAGES pages sorted by popularity —
// same tradeoff already accepted for AniList's equivalent query, just in Kitsu's own id space
// (Kitsu ids don't correspond to AniList ids, so AniList's candidate ids can't be reused here).
const CANDIDATE_MAX_PAGES = 2; // 2 * 20 = 40 candidates cap

async function getCandidateAnimeIds(params: GetCandidateAnimeIdsParams): Promise<number[]> {
    const filters = [
        params.season ? `filter[season]=${SEASON_TO_KITSU[params.season]}` : undefined,
        params.seasonYear !== undefined ? `filter[seasonYear]=${params.seasonYear}` : undefined,
        params.status ? `filter[status]=${params.status}` : undefined,
        params.formats && params.formats.length > 0
            ? `filter[subtype]=${params.formats
                  .map((format) => FORMAT_TO_KITSU_SUBTYPE[format])
                  .filter((subtype): subtype is string => subtype !== undefined)
                  .join(',')}`
            : undefined,
    ].filter((f): f is string => f !== undefined);

    const ids: number[] = [];
    let nextUrl: string | undefined = `/anime?${filters.join('&')}&sort=popularityRank&page[limit]=${PAGE_LIMIT}`;
    let page = 0;

    while (nextUrl && page < CANDIDATE_MAX_PAGES) {
        const response: KitsuCandidateAnimeResponse = await kitsuFetch<KitsuCandidateAnimeResponse>(nextUrl);

        ids.push(...response.data.map((anime) => Number(anime.id)));
        nextUrl = response.links?.next;
        page += 1;
    }

    return ids;
}

export { getMediaList, getCandidateAnimeIds };
