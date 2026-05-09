import type { AnilistMediaListEntry } from './media-list.types';
import type { AnimeEntry, MediaSeason, MediaStatus } from '@/services/models';


const selectAnimeEntry = (raw: AnilistMediaListEntry): AnimeEntry => ({
    id: raw.id,
    mediaId: raw.mediaId,
    title: raw.media.title.userPreferred,
    coverImageUrl: raw.media.coverImage.medium,
    chapters: raw.media.chapters ?? undefined,
    episodes: raw.media.episodes ?? undefined,
    status: raw.media.status as MediaStatus,
    nextAiringEpisode: raw.media.nextAiringEpisode ?? undefined,
    siteUrl: raw.media.siteUrl,
    endDate: {
        day: raw.media.endDate.day ?? undefined,
        month: raw.media.endDate.month ?? undefined,
        year: raw.media.endDate.year ?? undefined,
    },
    isAdult: raw.media.isAdult,
    season: (raw.media.season as MediaSeason) ?? undefined,
    genres: raw.media.genres,
    progress: raw.progress,
    repeat: raw.repeat,
});

const selectAnimeEntries = (raw: AnilistMediaListEntry[]): AnimeEntry[] => raw.map(selectAnimeEntry);

export { selectAnimeEntries };
