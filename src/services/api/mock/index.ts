import { getMockUser, getMockEntries } from './data';

import type { ApiProvider } from '../api.types';

const USER_ID_TO_NAME: Record<number, string> = {
    153365: 'lanzor',
    5306260: 'nalakuh',
};

const mockProvider: ApiProvider = {
    getUserByName: async (name) => getMockUser(name),
    getMediaList: async (userId) => getMockEntries(USER_ID_TO_NAME[userId] ?? 'lanzor'),
};

export { mockProvider };
