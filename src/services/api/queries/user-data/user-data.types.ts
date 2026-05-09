interface UserAvatar {
    medium: string;
}

interface UserData {
    id: number;
    name: string;
    avatar: UserAvatar;
    siteUrl: string;
}

interface GetUserByNameVariables {
    name: string;
}

interface GetUserByNameResponse {
    User: UserData;
}

export type {
    UserAvatar,
    UserData,
    GetUserByNameVariables,
    GetUserByNameResponse,
};
