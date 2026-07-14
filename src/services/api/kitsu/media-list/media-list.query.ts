import { getNextAiringByMalIds } from '../../shared';
import { kitsuFetch } from '../client';
import { selectAnimeEntries } from './media-list.selector';

import type { DenormalizedEntry } from './media-list.selector';
import type { KitsuAnimeResource, KitsuCategory, KitsuLibraryEntriesResponse, KitsuMapping } from './media-list.types';
import type { AnimeEntry, User } from '@/services/models';

function getMalIdsForAnime(anime: KitsuAnimeResource, mappingById: Map<string, KitsuMapping>): number[] {
    const refs = anime.relationships?.mappings?.data ?? [];

    return refs
        .map((ref) => mappingById.get(ref.id))
        .filter((mapping): mapping is KitsuMapping => mapping?.attributes.externalSite === 'myanimelist/anime')
        .map((mapping) => Number(mapping.attributes.externalId));
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

        const malId = getMalIdsForAnime(anime, mappingById)[0];

        return [{ entry, anime, categories, malId }];
    });

    const malIds = denormalized
        .filter(({ anime }) => anime.attributes.status === 'current')
        .map(({ malId }) => malId)
        .filter((malId): malId is number => malId !== undefined);

    const nextAiringByMalId = await getNextAiringByMalIds(malIds);

    return selectAnimeEntries(denormalized, nextAiringByMalId);
}

export { getMediaList };
