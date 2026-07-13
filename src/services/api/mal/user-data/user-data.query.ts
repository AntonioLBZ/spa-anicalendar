import { malFetch } from '../client';
import { selectUser } from './user-data.selector';

import type { MalUserResponse } from './user-data.types';
import type { User } from '@/services/models';

async function getUserByName(name: string): Promise<User> {
    const response = await malFetch<MalUserResponse>(`/user/${encodeURIComponent(name)}`);

    return selectUser(response);
}

export { getUserByName };
