import type { AnilistMediaType } from '../media-list/media-list.types';
import type { MediaFormat, MediaSeason, MediaStatus } from '@/services/models';

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
    seasonYear: number | null;
    genres: string[];
}

interface AnilistSeasonalResponse {
    Page: {
        media: AnilistSeasonalMedia[];
    };
}

interface AnilistSeasonalVariables {
    season?: MediaSeason;
    seasonYear?: number;
    type?: AnilistMediaType;
    format_in?: MediaFormat[];
    status?: MediaStatus;
    sort?: AnilistMediaSort[];
    perPage?: number;
}

interface GetSeasonalMediaParams {
    season: MediaSeason;
    seasonYear: number;
    /** Restrict results to these formats. Omit (or pass an empty array) to include every format.
     * @default undefined (all formats)
     */
    formats?: MediaFormat[];
    /** How many entries to fetch, sorted by popularity. Clamped to AniList's page-size cap of 50.
     * @default 50
     */
    perPage?: number;
    /** When true, only anime that premiered in the current season are included. When false, every currently-releasing anime is included (e.g. long-running or holdover series).
     * @default false
     */
    onlyNewSeason?: boolean;
}

export type {
    AnilistMediaSort,
    AnilistSeasonalMedia,
    AnilistSeasonalResponse,
    AnilistSeasonalVariables,
    GetSeasonalMediaParams,
};
