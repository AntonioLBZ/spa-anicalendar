interface AnilistUserResponse {
    User: {
        id: number;
        name: string;
        avatar: { large: string | null; medium: string | null } | null;
        bannerImage: string | null;
        options: { profileColor: string | null } | null;
        siteUrl: string;
    };
}

interface AnilistUserVariables {
    name: string;
}

export type { AnilistUserResponse, AnilistUserVariables };
