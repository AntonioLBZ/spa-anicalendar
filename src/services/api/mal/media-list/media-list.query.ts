import { getNextAiringByMalIds } from '../../shared';
import { malFetch } from '../client';
import { selectAnimeEntries } from './media-list.selector';

import type { MalAnimeListEntry, MalAnimeListResponse } from './media-list.types';
import type { AnimeEntry, MediaListEntryStatus } from '@/services/models';

const MAL_STATUS_MAP: Record<MediaListEntryStatus, string> = {
    WATCHING: 'watching',
    PLANNING: 'plan_to_watch',
};

async function getMediaList(userName: string, statuses: MediaListEntryStatus[] = ['WATCHING']): Promise<AnimeEntry[]> {
    // MAL's status query param accepts only one value per request, so fetch once per requested
    // status and merge, rather than one combined request (unlike Kitsu's combined filter[status]).
    const malStatuses = statuses.map((status) => MAL_STATUS_MAP[status]);

    const responses = await Promise.all(
        malStatuses.map((malStatus) =>
            malFetch<MalAnimeListResponse>(`/animelist/${encodeURIComponent(userName)}?status=${malStatus}`)
        )
    );

    const data: MalAnimeListEntry[] = responses.flatMap((response) => response.data);

    const currentlyAiringIds = data
        .filter((entry) => entry.node.status === 'currently_airing')
        .map((entry) => entry.node.id);

    const nextAiringByMalId = await getNextAiringByMalIds(currentlyAiringIds);

    return selectAnimeEntries(data, nextAiringByMalId);
}

export { getMediaList };
