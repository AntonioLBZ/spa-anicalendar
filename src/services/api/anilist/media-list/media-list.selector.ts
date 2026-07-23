import type { AnilistMediaListEntry } from './media-list.types';
import type { AnimeEntry, MediaFormat, MediaListEntryStatus, MediaSeason, MediaStatus } from '@/services/models';

// The mediaList entry's own status (distinct from media.status/the anime's airing status) —
// tells us which requested list (watching vs planning) this entry actually came from, so
// filterAiringEntries can apply the right inclusion rule per origin, not per airing status.
const LIST_STATUS_MAP: Record<string, MediaListEntryStatus> = {
    CURRENT: 'WATCHING',
    REPEATING: 'WATCHING',
    PLANNING: 'PLANNING',
};

const selectAnimeEntry = (raw: AnilistMediaListEntry): AnimeEntry => ({
    id: raw.id,
    mediaId: raw.mediaId,
    title: raw.media.title.userPreferred,
    coverImageUrl: raw.media.coverImage.large,
    chapters: raw.media.chapters ?? undefined,
    episodes: raw.media.episodes ?? undefined,
    duration: raw.media.duration ?? undefined,
    status: raw.media.status as MediaStatus,
    nextAiringEpisode: raw.media.nextAiringEpisode ?? undefined,
    siteUrl: raw.media.siteUrl,
    endDate: {
        day: raw.media.endDate.day ?? undefined,
        month: raw.media.endDate.month ?? undefined,
        year: raw.media.endDate.year ?? undefined,
    },
    isAdult: raw.media.isAdult,
    season: (raw.media.season as MediaSeason | null) ?? undefined,
    seasonYear: raw.media.seasonYear ?? undefined,
    format: (raw.media.format as MediaFormat | null) ?? undefined,
    listStatus: LIST_STATUS_MAP[raw.status],
    genres: raw.media.genres,
    progress: raw.progress,
    repeat: raw.repeat,
});

const selectAnimeEntries = (raw: AnilistMediaListEntry[]): AnimeEntry[] => raw.map(selectAnimeEntry);

export { selectAnimeEntries };
