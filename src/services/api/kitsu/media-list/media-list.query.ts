import { getNextAiringByAnilistIds, getNextAiringByMalIds } from '../../shared';
import { kitsuFetch } from '../client';
import { selectAnimeEntries } from './media-list.selector';

import type { DenormalizedEntry } from './media-list.selector';
import type { KitsuAnimeResource, KitsuCategory, KitsuLibraryEntriesResponse, KitsuMapping } from './media-list.types';
import type { AnimeEntry, User } from '@/services/models';

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

async function getMediaList(user: User): Promise<AnimeEntry[]> {
    const response = await kitsuFetch<KitsuLibraryEntriesResponse>(
        `/library-entries?filter[user_id]=${user.id}&filter[kind]=anime&filter[status]=current&include=anime,anime.mappings,anime.categories&page[limit]=20`,
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

    const currentlyAiring = denormalized.filter(({ anime }) => anime.attributes.status === 'current');

    const malIds = currentlyAiring.map(({ malId }) => malId).filter((malId): malId is number => malId !== undefined);

    // Kitsu's crowdsourced MAL crossreference is frequently missing for newer/niche titles even
    // though the show is actively airing and Kitsu already has an AniList crossreference for it —
    // fall back to looking the airing schedule up by AniList id instead of dropping the show.
    const anilistIdByAnimeId = new Map(
        currentlyAiring
            .filter(({ malId }) => malId === undefined)
            .map(({ anime }) => [anime.id, getExternalIdForAnime(anime, mappingById, 'anilist/anime')] as const)
            .filter((pair): pair is [string, number] => pair[1] !== undefined),
    );

    const [nextAiringByMalId, nextAiringByAnilistId] = await Promise.all([
        getNextAiringByMalIds(malIds),
        getNextAiringByAnilistIds([...anilistIdByAnimeId.values()]),
    ]);

    const entries = selectAnimeEntries(denormalized, nextAiringByMalId);

    for (const item of entries) {
        if (item.nextAiringEpisode) continue;

        const anilistId = anilistIdByAnimeId.get(String(item.mediaId));
        const fallbackAiring = anilistId !== undefined ? nextAiringByAnilistId[anilistId] : undefined;

        if (fallbackAiring) {
            item.nextAiringEpisode = fallbackAiring;
        }
    }

    return entries;
}

export { getMediaList };
