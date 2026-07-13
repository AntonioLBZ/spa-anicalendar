import { computeAiringAt } from './compute-airing-at';

import type { MalAnimeListEntry } from './media-list.types';
import type { AnimeEntry, MediaSeason, MediaStatus, PartialDate } from '@/services/models';

const STATUS_MAP: Record<string, MediaStatus> = {
    finished_airing: 'FINISHED',
    currently_airing: 'RELEASING',
    not_yet_aired: 'NOT_YET_RELEASED',
};

const SEASON_MAP: Record<string, MediaSeason> = {
    winter: 'WINTER',
    spring: 'SPRING',
    summer: 'SUMMER',
    fall: 'FALL',
};

function parseEndDate(endDate: string | undefined): PartialDate {
    if (!endDate) {
        return {};
    }

    const [year, month, day] = endDate.split('-').map(Number);

    return {
        year,
        month: month ?? undefined,
        day: day ?? undefined,
    };
}

const selectAnimeEntry = (raw: MalAnimeListEntry, now: Date): AnimeEntry => {
    const { node, list_status: listStatus } = raw;
    const progress = listStatus.num_episodes_watched;

    const nextAiringEpisode =
        node.status === 'currently_airing' && node.broadcast
            ? {
                  airingAt: computeAiringAt(node.broadcast.day_of_the_week, node.broadcast.start_time, now),
                  episode: progress + 1,
              }
            : undefined;

    return {
        id: node.id,
        mediaId: node.id,
        title: node.title,
        coverImageUrl: node.main_picture?.large ?? node.main_picture?.medium ?? '',
        episodes: node.num_episodes || undefined,
        status: STATUS_MAP[node.status],
        nextAiringEpisode,
        siteUrl: `https://myanimelist.net/anime/${node.id}`,
        endDate: parseEndDate(node.end_date),
        isAdult: node.nsfw === 'gray' || node.nsfw === 'black',
        season: node.start_season ? SEASON_MAP[node.start_season.season] : undefined,
        genres: node.genres?.map((genre) => genre.name) ?? [],
        progress,
        repeat: listStatus.is_rewatching ? 1 : 0,
    };
};

const selectAnimeEntries = (raw: MalAnimeListEntry[], now: Date = new Date()): AnimeEntry[] =>
    raw.map((entry) => selectAnimeEntry(entry, now));

export { selectAnimeEntries, selectAnimeEntry };
