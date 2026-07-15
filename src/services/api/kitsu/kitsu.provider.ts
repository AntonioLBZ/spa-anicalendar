import { getMediaList } from './media-list';
import { getUserByName } from './user-data';

import type { ApiProvider } from '../api.types';

const kitsuProvider: ApiProvider = {
    getUserByName,
    getMediaList,
};

export { kitsuProvider };
