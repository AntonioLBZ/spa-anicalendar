interface AnilistUserResponse {
    User: {
        id: number;
        name: string;
        avatar: { medium: string };
        siteUrl: string;
    };
}

interface AnilistUserVariables {
    name: string;
}

export type { AnilistUserResponse, AnilistUserVariables };
