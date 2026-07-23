import { getCurrentSeason } from '@/lib/airing';

import { getCandidateAnimeIds, getMediaList } from './media-list';
import { getUserByName } from './user-data';

import type { ApiProvider, MediaListFilters } from '../api.types';
import type { AnimeEntry, User } from '@/services/models';

const NO_FILTERS: MediaListFilters = { formats: [], onlyNewSeason: false };

// Same rationale as AniList's fetchPlanningEntries: a "planning" backlog can be large (hundreds
// of entries) with almost none of it relevant to a weekly calendar, and Kitsu's library-entries
// filter has no way to filter by the underlying anime's season/format server-side — but its own
// anime catalog (/anime) does. So we first fetch a bounded candidate id set (this season's roster
// + anything currently airing, regardless of season, both narrowed by the selected formats) from
// that catalog, then scope the planning fetch down to just those ids via filter[anime_id], instead
// of paging through the user's entire planning list. Kitsu's own ids, not AniList's — the two
// providers' candidate-id sets are not interchangeable.
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
