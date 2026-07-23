import { parseEndDate } from '../../shared';

import type { MalAnimeListEntry } from './media-list.types';
import type { AiringInfo, AnimeEntry, MediaFormat, MediaListEntryStatus, MediaSeason, MediaStatus } from '@/services/models';

const STATUS_MAP: Record<string, MediaStatus> = {
    finished_airing: 'FINISHED',
    currently_airing: 'RELEASING',
    not_yet_aired: 'NOT_YET_RELEASED',
};

// list_status.status is the LIBRARY-membership status (which requested list this came from),
// distinct from node.status (the anime's own airing status, mapped above via STATUS_MAP).
const LIST_STATUS_MAP: Record<string, MediaListEntryStatus> = {
    watching: 'WATCHING',
    plan_to_watch: 'PLANNING',
};

const SEASON_MAP: Record<string, MediaSeason> = {
    winter: 'WINTER',
    spring: 'SPRING',
    summer: 'SUMMER',
    fall: 'FALL',
};

const FORMAT_MAP: Record<string, MediaFormat> = {
    tv: 'TV',
    movie: 'MOVIE',
    ova: 'OVA',
    ona: 'ONA',
    special: 'SPECIAL',
    music: 'MUSIC',
};

type MalAiringLookup = Record<number, { nextAiringEpisode?: AiringInfo; season?: MediaSeason; seasonYear?: number }>;

const selectAnimeEntry = (raw: MalAnimeListEntry, nextAiringByMalId: MalAiringLookup): AnimeEntry => {
    const { node, list_status: listStatus } = raw;
    const progress = listStatus.num_episodes_watched;

    const nextAiringEpisode =
        node.status === 'currently_airing' ? nextAiringByMalId[node.id]?.nextAiringEpisode : undefined;

    return {
        id: node.id,
        mediaId: node.id,
        title: node.title,
        coverImageUrl: node.main_picture?.large ?? node.main_picture?.medium ?? '',
        episodes: node.num_episodes || undefined,
        duration: node.average_episode_duration ? Math.round(node.average_episode_duration / 60) : undefined,
        status: STATUS_MAP[node.status],
        nextAiringEpisode,
        siteUrl: `https://myanimelist.net/anime/${node.id}`,
        endDate: parseEndDate(node.end_date),
        // MAL's 'gray' flag is a fuzzy "might contain fanservice" heuristic (frequently over-applied)
        isAdult: node.nsfw === 'black',
        season: node.start_season ? SEASON_MAP[node.start_season.season] : undefined,
        seasonYear: node.start_season?.year,
        format: node.media_type ? FORMAT_MAP[node.media_type] : undefined,
        listStatus: LIST_STATUS_MAP[listStatus.status],
        genres: node.genres?.map((genre) => genre.name) ?? [],
        progress,
        repeat: listStatus.is_rewatching ? 1 : 0,
    };
};

const selectAnimeEntries = (raw: MalAnimeListEntry[], nextAiringByMalId: MalAiringLookup = {}): AnimeEntry[] =>
    raw.map((entry) => selectAnimeEntry(entry, nextAiringByMalId));

export { selectAnimeEntries, selectAnimeEntry };
