import { getMediaList } from './media-list';
import { getUserByName } from './user-data';

import type { ApiProvider } from '../api.types';

const anilistProvider: ApiProvider = {
    getUserByName,
    getMediaList: (user) => getMediaList({ userId: user.id, type: 'ANIME', statusIn: ['CURRENT', 'REPEATING'] }),
};

export { anilistProvider };
