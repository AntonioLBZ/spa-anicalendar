import { getCurrentSeason } from '@/lib/airing';

import { getCandidateAnimeIds, getMediaList } from './media-list';
import { getUserByName } from './user-data';

import type { ApiProvider, MediaListFilters } from '../api.types';
import type { AnimeEntry, User } from '@/services/models';

const NO_FILTERS: MediaListFilters = { formats: [], onlyNewSeason: false };

// Kitsu's library-entries filter can't filter by the underlying anime's season/format, so
// planning entries are narrowed via a candidate anime id set from the anime catalog instead of
// paging through the user's entire (potentially huge) planning list.
async function fetchPlanningEntries(user: User, filters: MediaListFilters): Promise<AnimeEntry[]> {
    const { season, seasonYear } = getCurrentSeason();
    const { formats, onlyNewSeason } = filters;

    const idQueries = [getCandidateAnimeIds({ season, seasonYear, formats })];
    if (!onlyNewSeason) {
        idQueries.push(getCandidateAnimeIds({ status: 'current', formats }));
    }

    const candidateIds = [...new Set((await Promise.all(idQueries)).flat())];

    return getMediaList(user, ['PLANNING'], candidateIds);
}

const kitsuProvider: ApiProvider = {
    getUserByName,
    getMediaList: async (user, statuses, filters = NO_FILTERS): Promise<AnimeEntry[]> => {
        const results = await Promise.all(
            statuses.map((status) => (status === 'PLANNING' ? fetchPlanningEntries(user, filters) : getMediaList(user, [status]))),
        );

        return results.flat();
    },
};

export { kitsuProvider };
