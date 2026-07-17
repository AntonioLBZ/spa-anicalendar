import type { AnilistSeasonalMedia } from './seasonal.types';
import type { AnimeEntry, MediaSeason, MediaStatus } from '@/services/models';

const selectSeasonalEntry = (media: AnilistSeasonalMedia): AnimeEntry => ({
    id: media.id,
    mediaId: media.id,
    title: media.title.userPreferred,
    coverImageUrl: media.coverImage.large,
    chapters: media.chapters ?? undefined,
    episodes: media.episodes ?? undefined,
    duration: media.duration ?? undefined,
    status: media.status as MediaStatus,
    nextAiringEpisode: media.nextAiringEpisode ?? undefined,
    siteUrl: media.siteUrl,
    endDate: {
        day: media.endDate.day ?? undefined,
        month: media.endDate.month ?? undefined,
        year: media.endDate.year ?? undefined,
    },
    isAdult: media.isAdult,
    season: (media.season as MediaSeason | null) ?? undefined,
    genres: media.genres,
});

const selectSeasonalEntries = (media: AnilistSeasonalMedia[]): AnimeEntry[] => media.map(selectSeasonalEntry);

export { selectSeasonalEntries };
