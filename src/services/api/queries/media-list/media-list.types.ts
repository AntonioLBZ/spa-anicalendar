type MediaType = 'ANIME' | 'MANGA';

type MediaListStatus =
    | 'CURRENT'
    | 'PLANNING'
    | 'COMPLETED'
    | 'DROPPED'
    | 'PAUSED'
    | 'REPEATING';

type MediaListSort =
    | 'MEDIA_ID'
    | 'MEDIA_ID_DESC'
    | 'SCORE'
    | 'SCORE_DESC'
    | 'STATUS'
    | 'STATUS_DESC'
    | 'PROGRESS'
    | 'PROGRESS_DESC'
    | 'PROGRESS_VOLUMES'
    | 'PROGRESS_VOLUMES_DESC'
    | 'REPEAT'
    | 'REPEAT_DESC'
    | 'PRIORITY'
    | 'PRIORITY_DESC'
    | 'STARTED_ON'
    | 'STARTED_ON_DESC'
    | 'FINISHED_ON'
    | 'FINISHED_ON_DESC'
    | 'ADDED_TIME'
    | 'ADDED_TIME_DESC'
    | 'UPDATED_TIME'
    | 'UPDATED_TIME_DESC'
    | 'MEDIA_TITLE_ROMAJI'
    | 'MEDIA_TITLE_ROMAJI_DESC'
    | 'MEDIA_TITLE_ENGLISH'
    | 'MEDIA_TITLE_ENGLISH_DESC'
    | 'MEDIA_TITLE_NATIVE'
    | 'MEDIA_TITLE_NATIVE_DESC'
    | 'MEDIA_POPULARITY'
    | 'MEDIA_POPULARITY_DESC';

type MediaStatus =
    | 'FINISHED'
    | 'RELEASING'
    | 'NOT_YET_RELEASED'
    | 'CANCELLED'
    | 'HIATUS';

type MediaSeason = 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL';

interface FuzzyDate {
    day: number | null;
    month: number | null;
    year: number | null;
}

interface CoverImage {
    medium: string;
}

interface NextAiringEpisode {
    airingAt: number;
    episode: number;
}

interface MediaTitle {
    userPreferred: string;
}

interface Media {
    coverImage: CoverImage;
    chapters: number | null;
    episodes: number | null;
    status: MediaStatus;
    nextAiringEpisode: NextAiringEpisode | null;
    siteUrl: string;
    title: MediaTitle;
    endDate: FuzzyDate;
    isAdult: boolean;
    season: MediaSeason | null;
    genres: string[];
}

interface MediaListEntry {
    id: number;
    media: Media;
    progress: number;
    mediaId: number;
    repeat: number;
}

interface GetMediaListVariables {
    userId: number;
    type?: MediaType;
    statusIn?: MediaListStatus[];
    sort?: MediaListSort[];
}

interface GetMediaListResponse {
    Page: {
        mediaList: MediaListEntry[];
    };
}

interface GetMediaListParams {
    userId: number;
    type?: MediaType;
    statusIn?: MediaListStatus[];
    sort?: MediaListSort[];
}

export type {
    MediaType,
    MediaListStatus,
    MediaListSort,
    MediaStatus,
    MediaSeason,
    FuzzyDate,
    CoverImage,
    NextAiringEpisode,
    MediaTitle,
    Media,
    MediaListEntry,
    GetMediaListVariables,
    GetMediaListResponse,
    GetMediaListParams,
};
