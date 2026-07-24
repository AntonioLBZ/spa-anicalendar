import { getCurrentSeason } from '@/lib/airing';

import { getCandidateMediaIds, getMediaList } from './media-list';
import { getUserByName } from './user-data';

import type { ApiProvider, MediaListFilters } from '../api.types';
import type { AnilistMediaListStatus } from './media-list/media-list.types';
import type { AnimeEntry, MediaListEntryStatus } from '@/services/models';

const statusInMap: Record<MediaListEntryStatus, AnilistMediaListStatus[]> = {
    WATCHING: ['CURRENT', 'REPEATING'],
    PLANNING: ['PLANNING'],
};

const NO_FILTERS: MediaListFilters = { formats: [], onlyNewSeason: false };

// AniList's mediaList query can't filter by the underlying media's season/status/format, so
// planning entries are narrowed via a candidate media id set from the catalog query instead of
// pulling the user's entire (potentially huge) planning list.
async function fetchPlanningEntries(userId: number, filters: MediaListFilters): Promise<AnimeEntry[]> {
    const { season, seasonYear } = getCurrentSeason();
    const { formats, onlyNewSeason } = filters;

    const idQueries = [getCandidateMediaIds({ season, seasonYear, formats })];
    if (!onlyNewSeason) {
        idQueries.push(getCandidateMediaIds({ status: 'RELEASING', formats }));
    }

    const candidateIds = [...new Set((await Promise.all(idQueries)).flat())];

    return getMediaList({ userId, type: 'ANIME', statusIn: statusInMap.PLANNING, mediaIdIn: candidateIds });
}

const anilistProvider: ApiProvider = {
    getUserByName,
    getMediaList: async (user, statuses, filters = NO_FILTERS): Promise<AnimeEntry[]> => {
        const results = await Promise.all(
            statuses.map((status) =>
                status === 'PLANNING'
                    ? fetchPlanningEntries(user.id, filters)
                    : getMediaList({ userId: user.id, type: 'ANIME', statusIn: statusInMap[status] }),
            ),
        );

        return results.flat();
    },
};

export { anilistProvider };
