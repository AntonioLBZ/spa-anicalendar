import { kitsuFetch, KitsuUserNotFoundError } from '../client';
import { selectUser } from './user-data.selector';

import type { KitsuUsersResponse } from './user-data.types';
import type { User } from '@/services/models';

async function getUserByName(name: string): Promise<User> {
    const response = await kitsuFetch<KitsuUsersResponse>(
        `/users?filter[name]=${encodeURIComponent(name)}&page[limit]=1`,
    );

    if (response.data.length === 0) {
        throw new KitsuUserNotFoundError(`Kitsu user not found: ${name}.`);
    }

    return selectUser(response.data[0]);
}

export { getUserByName };
