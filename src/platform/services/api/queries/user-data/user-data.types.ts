interface IUserAvatar {
    medium: string;
}

interface IUserData {
    id: number;
    name: string;
    avatar: IUserAvatar;
    siteUrl: string;
}

interface IGetUserByNameVariables {
    name: string;
}

interface IGetUserByNameResponse {
    User: IUserData;
}

export type {
    IUserAvatar,
    IUserData,
    IGetUserByNameVariables,
    IGetUserByNameResponse,
};
