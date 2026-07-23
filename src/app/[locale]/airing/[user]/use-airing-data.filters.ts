import { isFinishedInCurrentSeason, startedInCurrentSeason } from '@/lib/airing';

import type { AnimeEntry, MediaFormat, MediaListEntryStatus } from '@/services/models';

export interface AiringFilters {
    formats: MediaFormat[];
    onlyNewSeason: boolean;
}

export interface UserListFilter {
    watching: boolean;
    planning: boolean;
}

export function buildRequestedStatuses(userList: UserListFilter): MediaListEntryStatus[] {
    const statuses: MediaListEntryStatus[] = [];
    if (userList.watching) statuses.push('WATCHING');
    if (userList.planning) statuses.push('PLANNING');
    return statuses.length > 0 ? statuses : (['WATCHING'] as const);
}

export function filterAiringEntries(entries: AnimeEntry[], filters: AiringFilters): AnimeEntry[] {
    const hasFormatFilter = filters.formats.length > 0;

    return entries.filter((entry) => {
        // Apply format filter: include if no filter active, or if format matches
        if (hasFormatFilter) {
            if (entry.format === undefined || !filters.formats.includes(entry.format)) {
                return false;
            }
        }

        // Keep RELEASING entries
        if (entry.status === 'RELEASING') {
            // Apply onlyNewSeason filter if enabled: per-entry rule
            if (filters.onlyNewSeason) {
                return startedInCurrentSeason(entry) || (entry.season === undefined && entry.seasonYear === undefined);
            }
            return true;
        }

        // Keep FINISHED entries that are finished in the current season
        if (entry.status === 'FINISHED' && isFinishedInCurrentSeason(entry)) {
            return true;
        }

        // Watching-sourced entries are kept unconditionally beyond this point, regardless of
        // their media status (old FINISHED, HIATUS, CANCELLED, NOT_YET_RELEASED, etc.) — this
        // preserves the pre-feature behavior of showing the entire watching list unfiltered by
        // media status; only newly-introduced filters (format, onlyNewSeason above) can narrow it.
        if (entry.listStatus === 'WATCHING') {
            return true;
        }

        // Planning-sourced entries (or unresolved origin) have no such unconditional fallback —
        // a planned show only belongs on a weekly airing calendar if there's something to show:
        // it's about to premiere this season (not yet released, but starting in the current season).
        if (entry.status === 'NOT_YET_RELEASED' && startedInCurrentSeason(entry)) {
            return true;
        }

        // Exclude everything else (old finished planning entries, upcoming shows in a different
        // season, HIATUS/CANCELLED planning entries, etc.)
        return false;
    });
}
