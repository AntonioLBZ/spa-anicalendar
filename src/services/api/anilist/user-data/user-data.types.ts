interface AnilistUserResponse {
    User: {
        id: number;
        name: string;
        avatar: { medium: string | null } | null;
        siteUrl: string;
    };
}

interface AnilistUserVariables {
    name: string;
}

export type { AnilistUserResponse, AnilistUserVariables };
