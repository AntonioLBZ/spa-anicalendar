import { getNextAiringByMalIds } from '../../shared';
import { malFetch } from '../client';
import { selectAnimeEntries } from './media-list.selector';

import type { MalAnimeListResponse } from './media-list.types';
import type { AnimeEntry } from '@/services/models';

async function getMediaList(userName: string): Promise<AnimeEntry[]> {
    const response = await malFetch<MalAnimeListResponse>(`/animelist/${encodeURIComponent(userName)}`);

    const currentlyAiringIds = response.data
        .filter((entry) => entry.node.status === 'currently_airing')
        .map((entry) => entry.node.id);

    const nextAiringByMalId = await getNextAiringByMalIds(currentlyAiringIds);

    return selectAnimeEntries(response.data, nextAiringByMalId);
}

export { getMediaList };
