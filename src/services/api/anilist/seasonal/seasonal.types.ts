import type { AnilistMediaType } from '../media-list/media-list.types';
import type { MediaSeason, MediaStatus } from '@/services/models';

type AnilistMediaFormat = 'TV' | 'TV_SHORT' | 'MOVIE' | 'SPECIAL' | 'OVA' | 'ONA' | 'MUSIC';

type AnilistMediaSort = 'POPULARITY_DESC' | 'POPULARITY';

interface AnilistSeasonalMedia {
    id: number;
    coverImage: { medium: string; large: string };
    chapters: number | null;
    episodes: number | null;
    duration: number | null;
    status: string;
    nextAiringEpisode: { airingAt: number; episode: number } | null;
    siteUrl: string;
    title: { userPreferred: string };
    endDate: { day: number | null; month: number | null; year: number | null };
    isAdult: boolean;
    season: string | null;
    genres: string[];
}

interface AnilistSeasonalResponse {
    Page: {
        media: AnilistSeasonalMedia[];
    };
}

interface AnilistSeasonalVariables {
    season: MediaSeason;
    seasonYear: number;
    type?: AnilistMediaType;
    format?: AnilistMediaFormat;
    status?: MediaStatus;
    sort?: AnilistMediaSort[];
}

interface GetSeasonalMediaParams {
    season: MediaSeason;
    seasonYear: number;
}

export type {
    AnilistMediaFormat,
    AnilistMediaSort,
    AnilistSeasonalMedia,
    AnilistSeasonalResponse,
    AnilistSeasonalVariables,
    GetSeasonalMediaParams,
};
