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
    /** The list entry id (unique per user list entry, used as the React key). */
    id: number;
    /** The id of the underlying media, shared across all users who have it on their list. */
    mediaId: number;
    title: string;
    coverImageUrl: string;
    /** Total manga chapters when complete. Only relevant if this entry is a manga. */
    chapters?: number;
    /** Total episodes when complete. Absent while still unknown/unannounced. */
    episodes?: number;
    /** Average episode runtime in minutes. */
    duration?: number;
    status: MediaStatus;
    /** The next episode scheduled to air. Absent if not currently releasing. */
    nextAiringEpisode?: AiringInfo;
    siteUrl: string;
    /** The date the anime finished airing/publishing. */
    endDate: PartialDate;
    isAdult: boolean;
    /** The season it originally released in. */
    season?: MediaSeason;
    genres: string[];
    /** Episodes/chapters the user has watched/read so far. Absent for entries with no per-user list (e.g. anonymous seasonal browsing). */
    progress?: number;
    /** Number of times the user has rewatched/reread this entry. Absent for entries with no per-user list; no renderer currently reads it. */
    repeat?: number;
}

export type { MediaStatus, MediaSeason, PartialDate, AiringInfo, AnimeEntry };
