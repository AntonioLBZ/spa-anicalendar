import { getMediaList } from './media-list';
import { getUserByName } from './user-data';

import type { ApiProvider } from '../api.types';

const malProvider: ApiProvider = {
    getUserByName,
    getMediaList: (user, statuses) => getMediaList(user.name, statuses),
};

export { malProvider };
