type AnilistMediaType = 'ANIME' | 'MANGA';

type AnilistMediaListStatus =
    | 'CURRENT'
    | 'PLANNING'
    | 'COMPLETED'
    | 'DROPPED'
    | 'PAUSED'
    | 'REPEATING';

type AnilistMediaListSort =
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

interface AnilistMediaListEntry {
    id: number;
    media: {
        coverImage: { medium: string };
        chapters: number | null;
        episodes: number | null;
        status: string;
        nextAiringEpisode: { airingAt: number; episode: number } | null;
        siteUrl: string;
        title: { userPreferred: string };
        endDate: { day: number | null; month: number | null; year: number | null };
        isAdult: boolean;
        season: string | null;
        genres: string[];
    };
    progress: number;
    mediaId: number;
    repeat: number;
}

interface AnilistMediaListResponse {
    Page: {
        mediaList: AnilistMediaListEntry[];
    };
}

interface AnilistMediaListVariables {
    userId: number;
    type?: AnilistMediaType;
    statusIn?: AnilistMediaListStatus[];
    sort?: AnilistMediaListSort[];
}

interface GetMediaListParams {
    userId: number;
    type?: AnilistMediaType;
    statusIn?: AnilistMediaListStatus[];
    sort?: AnilistMediaListSort[];
}

export type {
    AnilistMediaType,
    AnilistMediaListStatus,
    AnilistMediaListSort,
    AnilistMediaListEntry,
    AnilistMediaListResponse,
    AnilistMediaListVariables,
    GetMediaListParams,
};
