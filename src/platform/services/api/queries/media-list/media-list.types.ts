type TMediaType = 'ANIME' | 'MANGA';

type TMediaListStatus =
    | 'CURRENT'
    | 'PLANNING'
    | 'COMPLETED'
    | 'DROPPED'
    | 'PAUSED'
    | 'REPEATING';

type TMediaListSort =
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

type TMediaStatus =
    | 'FINISHED'
    | 'RELEASING'
    | 'NOT_YET_RELEASED'
    | 'CANCELLED'
    | 'HIATUS';

type TMediaSeason = 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL';

interface IFuzzyDate {
    day: number | null;
    month: number | null;
    year: number | null;
}

interface ICoverImage {
    medium: string;
}

interface INextAiringEpisode {
    airingAt: number;
    episode: number;
}

interface IMediaTitle {
    userPreferred: string;
}

interface IMedia {
    coverImage: ICoverImage;
    chapters: number | null;
    episodes: number | null;
    status: TMediaStatus;
    nextAiringEpisode: INextAiringEpisode | null;
    siteUrl: string;
    title: IMediaTitle;
    endDate: IFuzzyDate;
    isAdult: boolean;
    season: TMediaSeason | null;
}

interface IMediaListEntry {
    id: number;
    media: IMedia;
    progress: number;
    mediaId: number;
    repeat: number;
}

interface IGetMediaListVariables {
    userId: number;
    type?: TMediaType;
    statusIn?: TMediaListStatus[];
    sort?: TMediaListSort[];
}

interface IGetMediaListResponse {
    Page: {
        mediaList: IMediaListEntry[];
    };
}

interface IGetMediaListParams {
    userId: number;
    type?: TMediaType;
    statusIn?: TMediaListStatus[];
    sort?: TMediaListSort[];
}

export type {
    TMediaType,
    TMediaListStatus,
    TMediaListSort,
    TMediaStatus,
    TMediaSeason,
    IFuzzyDate,
    ICoverImage,
    INextAiringEpisode,
    IMediaTitle,
    IMedia,
    IMediaListEntry,
    IGetMediaListVariables,
    IGetMediaListResponse,
    IGetMediaListParams,
};
