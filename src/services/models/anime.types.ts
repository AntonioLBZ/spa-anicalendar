type MediaStatus = 'FINISHED' | 'RELEASING' | 'NOT_YET_RELEASED' | 'CANCELLED' | 'HIATUS';

type MediaSeason = 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL';

interface PartialDate {
    day?: number;
    month?: number;
    year?: number;
}

interface AiringInfo {
    airingAt: number;
    episode: number;
}

interface AnimeEntry {
    id: number;
    mediaId: number;
    title: string;
    coverImageUrl: string;
    chapters?: number;
    episodes?: number;
    status: MediaStatus;
    nextAiringEpisode?: AiringInfo;
    siteUrl: string;
    endDate: PartialDate;
    isAdult: boolean;
    season?: MediaSeason;
    genres: string[];
    progress: number;
    repeat: number;
}

export type { MediaStatus, MediaSeason, PartialDate, AiringInfo, AnimeEntry };
