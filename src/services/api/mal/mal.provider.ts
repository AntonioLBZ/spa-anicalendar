import { getMediaList } from './media-list';
import { getUserByName } from './user-data';

import type { ApiProvider } from '../api.types';

const malProvider: ApiProvider = {
    getUserByName,
    getMediaList: (user) => getMediaList(user.name),
};

export { malProvider };
