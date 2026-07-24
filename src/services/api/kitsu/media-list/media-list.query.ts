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

// MediaFormat to Kitsu's own subtype enum. TV_SHORT has no Kitsu equivalent.
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

interface KitsuPage {
    links?: { next?: string };
}

// Kitsu's JSON:API pagination follows `links.next` (a full URL) until exhausted or maxPages.
async function paginateByCursor<TResponse extends KitsuPage>(
    initialUrl: string,
    maxPages: number,
    fetchPage: (url: string) => Promise<TResponse>,
): Promise<TResponse[]> {
    const responses: TResponse[] = [];
    let nextUrl: string | undefined = initialUrl;
    let page = 0;

    while (nextUrl && page < maxPages) {
        const response = await fetchPage(nextUrl);
        responses.push(response);
        nextUrl = response.links?.next;
        page += 1;
    }

    return responses;
}

// Kitsu's library-entries endpoint caps page[limit] at 20, so large lists must be paged through
// via the JSON:API `links.next` URL. MAX_PAGES is a safety net against a runaway/misbehaving API.
const PAGE_LIMIT = 20;
const MAX_PAGES = 40;

async function getMediaList(
    user: User,
    statuses: MediaListEntryStatus[] = ['WATCHING'],
    animeIdIn?: number[],
): Promise<AnimeEntry[]> {
    if (animeIdIn && animeIdIn.length === 0) {
        return [];
    }

    const kitsuStatusMap: Record<MediaListEntryStatus, string> = {
        WATCHING: 'current',
        PLANNING: 'planned',
    };

    const kitsuStatuses = statuses.map((s) => kitsuStatusMap[s]).join(',');
    const animeIdFilter = animeIdIn ? `&filter[anime_id]=${animeIdIn.join(',')}` : '';

    const initialUrl = `/library-entries?filter[user_id]=${user.id}&filter[kind]=anime&filter[status]=${kitsuStatuses}${animeIdFilter}&include=anime,anime.mappings,anime.categories&page[limit]=${PAGE_LIMIT}`;

    const responses = await paginateByCursor(initialUrl, MAX_PAGES, (url) => kitsuFetch<KitsuLibraryEntriesResponse>(url));
    const data = responses.flatMap((response) => response.data);
    const included = responses.flatMap((response) => response.included ?? []);

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

    const currentlyAiring = denormalized.filter(({ anime }) => anime.attributes.status === 'current');
    const currentlyAiringIds = new Set(currentlyAiring.map(({ anime }) => anime.id));

    return entries.map((item, index) => {
        const isCurrentlyAiring = currentlyAiringIds.has(denormalized[index].anime.id);

        if (!isCurrentlyAiring && item.nextAiringEpisode) {
            return { ...item, nextAiringEpisode: undefined };
        }

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

// Id-only lookup against Kitsu's public anime catalog, which supports season/status/subtype
// filtering server-side (unlike /library-entries). Used to build a bounded candidate id set for
// the "planning" fetch. Sorted by popularity, capped at CANDIDATE_MAX_PAGES pages.
const CANDIDATE_MAX_PAGES = 5;

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

    const initialUrl = `/anime?${filters.join('&')}&sort=popularityRank&page[limit]=${PAGE_LIMIT}`;

    const responses = await paginateByCursor(initialUrl, CANDIDATE_MAX_PAGES, (url) => kitsuFetch<KitsuCandidateAnimeResponse>(url));

    return responses.flatMap((response) => response.data.map((anime) => Number(anime.id)));
}

export { getMediaList, getCandidateAnimeIds };
