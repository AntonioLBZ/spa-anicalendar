import type { NextAiringEpisode } from './anilist-airing-lookup';
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

const selectAnimeEntry = (raw: MalAnimeListEntry, nextAiringByMalId: Record<number, NextAiringEpisode>): AnimeEntry => {
    const { node, list_status: listStatus } = raw;
    const progress = listStatus.num_episodes_watched;

    const nextAiringEpisode = node.status === 'currently_airing' ? nextAiringByMalId[node.id] : undefined;

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

const selectAnimeEntries = (
    raw: MalAnimeListEntry[],
    nextAiringByMalId: Record<number, NextAiringEpisode> = {},
): AnimeEntry[] => raw.map((entry) => selectAnimeEntry(entry, nextAiringByMalId));

export { selectAnimeEntries, selectAnimeEntry };
