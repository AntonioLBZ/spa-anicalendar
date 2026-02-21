import { anilistQuery } from '../../anilist-client';
import {
    GetUserByNameResponse,
    GetUserByNameVariables,
    UserData,
} from './user-data.types';

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

async function getUserByName(name: string): Promise<UserData> {
    const response = await anilistQuery<
        GetUserByNameResponse,
        GetUserByNameVariables
    >(GET_USER_BY_NAME, { name });

    if (response.errors) {
        throw new Error(response.errors[0].message);
    }

    return response.data.User;
}

export { getUserByName };
