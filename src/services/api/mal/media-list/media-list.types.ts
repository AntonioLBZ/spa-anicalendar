interface MalGenre {
    id: number;
    name: string;
}

interface MalStartSeason {
    year: number;
    season: string;
}

interface MalAnimeNode {
    id: number;
    title: string;
    main_picture?: { medium: string; large: string };
    num_episodes?: number;
    status: 'finished_airing' | 'currently_airing' | 'not_yet_aired';
    start_season?: MalStartSeason;
    genres?: MalGenre[];
    media_type: string;
    nsfw?: 'white' | 'gray' | 'black';
    end_date?: string;
}

interface MalListStatus {
    status: string;
    score: number;
    num_episodes_watched: number;
    is_rewatching: boolean;
    updated_at: string;
    start_date?: string;
    finish_date?: string;
}

interface MalAnimeListEntry {
    node: MalAnimeNode;
    list_status: MalListStatus;
}

interface MalAnimeListResponse {
    data: MalAnimeListEntry[];
    paging?: { next?: string };
}

export type { MalGenre, MalStartSeason, MalAnimeNode, MalListStatus, MalAnimeListEntry, MalAnimeListResponse };
