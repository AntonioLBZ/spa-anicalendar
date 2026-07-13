import { malFetch } from '../client';
import { selectAnimeEntries } from './media-list.selector';

import type { MalAnimeListResponse } from './media-list.types';
import type { AnimeEntry } from '@/services/models';

async function getMediaList(userName: string): Promise<AnimeEntry[]> {
    const response = await malFetch<MalAnimeListResponse>(`/animelist/${encodeURIComponent(userName)}`);

    return selectAnimeEntries(response.data);
}

export { getMediaList };
