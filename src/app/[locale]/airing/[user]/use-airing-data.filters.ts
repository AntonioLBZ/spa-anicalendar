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
        if (hasFormatFilter && (entry.format === undefined || !filters.formats.includes(entry.format))) {
            return false;
        }

        if (entry.status === 'RELEASING') {
            if (filters.onlyNewSeason) {
                return startedInCurrentSeason(entry) || (entry.season === undefined && entry.seasonYear === undefined);
            }
            return true;
        }

        if (entry.status === 'FINISHED' && isFinishedInCurrentSeason(entry)) {
            return true;
        }

        // Watching-sourced entries are always shown regardless of media status; planning-sourced
        // entries only show if premiering this season.
        if (entry.listStatus === 'WATCHING') {
            return true;
        }

        return entry.status === 'NOT_YET_RELEASED' && startedInCurrentSeason(entry);
    });
}
