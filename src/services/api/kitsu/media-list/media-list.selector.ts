import { parseEndDate } from '../../shared';

import type { KitsuAnimeResource, KitsuCategory, KitsuLibraryEntry } from './media-list.types';
import type { AiringInfo, AnimeEntry, MediaStatus } from '@/services/models';

// Kitsu's status enum has no equivalent to CANCELLED/HIATUS, so those AniList-only values never appear here.
const STATUS_MAP: Record<string, MediaStatus> = {
    current: 'RELEASING',
    finished: 'FINISHED',
    upcoming: 'NOT_YET_RELEASED',
    tba: 'NOT_YET_RELEASED',
};

interface DenormalizedEntry {
    entry: KitsuLibraryEntry;
    anime: KitsuAnimeResource;
    categories: KitsuCategory[];
    malId: number | undefined;
}

const selectAnimeEntry = (
    { entry, anime, categories, malId }: DenormalizedEntry,
    nextAiringByMalId: Record<number, AiringInfo>,
): AnimeEntry => {
    const isCurrentlyAiring = anime.attributes.status === 'current';
    const nextAiringEpisode = isCurrentlyAiring && malId !== undefined ? nextAiringByMalId[malId] : undefined;

    return {
        id: Number(entry.id),
        mediaId: Number(anime.id),
        title: anime.attributes.canonicalTitle,
        coverImageUrl: anime.attributes.posterImage?.large ?? anime.attributes.posterImage?.medium ?? '',
        episodes: anime.attributes.episodeCount ?? undefined,
        status: STATUS_MAP[anime.attributes.status] ?? 'NOT_YET_RELEASED',
        nextAiringEpisode,
        siteUrl: `https://kitsu.io/anime/${anime.attributes.slug}`,
        endDate: parseEndDate(anime.attributes.endDate),
        isAdult: anime.attributes.ageRating === 'R18',
        season: undefined,
        genres: categories.map((category) => category.attributes.title),
        progress: entry.attributes.progress,
        repeat: entry.attributes.reconsumeCount ?? 0,
    };
};

const selectAnimeEntries = (
    entries: DenormalizedEntry[],
    nextAiringByMalId: Record<number, AiringInfo> = {},
): AnimeEntry[] => entries.map((entry) => selectAnimeEntry(entry, nextAiringByMalId));

export { selectAnimeEntries, selectAnimeEntry };
export type { DenormalizedEntry };
