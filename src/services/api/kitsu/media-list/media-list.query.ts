import { getNextAiringByAnilistIds, getNextAiringByMalIds } from '../../shared';
import { kitsuFetch } from '../client';
import { selectAnimeEntries } from './media-list.selector';

import type { DenormalizedEntry } from './media-list.selector';
import type { KitsuAnimeResource, KitsuCategory, KitsuLibraryEntriesResponse, KitsuMapping } from './media-list.types';
import type { AnimeEntry, MediaListEntryStatus, User } from '@/services/models';

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

async function getMediaList(user: User, statuses: MediaListEntryStatus[] = ['WATCHING']): Promise<AnimeEntry[]> {
    const kitsuStatusMap: Record<MediaListEntryStatus, string> = {
        WATCHING: 'current',
        PLANNING: 'planned',
    };

    const kitsuStatuses = statuses.map((s) => kitsuStatusMap[s]).join(',');
    const response = await kitsuFetch<KitsuLibraryEntriesResponse>(
        `/library-entries?filter[user_id]=${user.id}&filter[kind]=anime&filter[status]=${kitsuStatuses}&include=anime,anime.mappings,anime.categories&page[limit]=20`,
    );

    const included = response.included ?? [];
    const animeById = new Map(included.filter((r): r is KitsuAnimeResource => r.type === 'anime').map((r) => [r.id, r]));
    const mappingById = new Map(included.filter((r): r is KitsuMapping => r.type === 'mappings').map((r) => [r.id, r]));
    const categoryById = new Map(included.filter((r): r is KitsuCategory => r.type === 'categories').map((r) => [r.id, r]));

    const denormalized: DenormalizedEntry[] = response.data.flatMap((entry) => {
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
    // IMPORTANT: AniList's Page connection hard-caps perPage at 50. Kitsu's page[limit]=20 currently keeps
    // this safe (id lists stay well under 50), but if page[limit] is ever raised above ~50, the AniList
    // lookup must be chunked to avoid silent truncation. See anilist-airing-lookup.ts line 36.
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

export { getMediaList };
