import { getMockUser, getMockEntries } from './data';

import type { ApiProvider } from '../api.types';

const mockProvider: ApiProvider = {
    getUserByName: async (name) => getMockUser(name),
    getMediaList: async (user) => getMockEntries(user.name),
};

export { mockProvider };
