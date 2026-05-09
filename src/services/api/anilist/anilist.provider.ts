import { getMediaList } from './media-list';
import { getUserByName } from './user-data';

import type { ApiProvider } from '../api.types';

const anilistProvider: ApiProvider = {
    getUserByName,
    getMediaList: (userId) => getMediaList({ userId, type: 'ANIME', statusIn: ['CURRENT', 'REPEATING'] }),
};

export { anilistProvider };
