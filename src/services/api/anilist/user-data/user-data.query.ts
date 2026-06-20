import { anilistQuery } from '../client';
import { selectUser } from './user-data.selector';

import type { AnilistUserResponse, AnilistUserVariables } from './user-data.types';
import type { User } from '@/services/models';

const GET_USER_BY_NAME = `
query GetUserByName($name: String) {
  User(name: $name) {
    avatar {
      medium
    }
    name
    id
    siteUrl
  }
}
`;

async function getUserByName(name: string): Promise<User> {
    const response = await anilistQuery<AnilistUserResponse, AnilistUserVariables>(GET_USER_BY_NAME, { name });

    if (response.errors) {
        throw new Error(response.errors[0].message);
    }

    return selectUser(response.data);
}

export { getUserByName };
