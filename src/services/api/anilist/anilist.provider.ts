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

// "Watching" must show the entire current/repeating list unconditionally, so it's always fetched
// in full. "Planning" backlogs can be enormous (hundreds of entries) with almost none of it
// relevant to a weekly calendar, and AniList's mediaList query has no way to filter by the
// underlying media's season/status/format server-side — but its media catalog query does. So for
// planning we first fetch a bounded candidate id set (this season's roster + anything currently
// releasing, regardless of season, both narrowed by the selected formats) from the catalog, then
// scope the planning list fetch down to just those ids via mediaId_in, instead of pulling the
// user's entire planning list. When onlyNewSeason is on, the "currently releasing regardless of
// season" query is skipped: it would only surface releases outside the current season, which the
// onlyNewSeason filter rejects anyway, so it's a subset of the season-roster query already made.
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
