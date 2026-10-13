interface KitsuUserResource {
    id: string;
    attributes: {
        name: string;
        avatar: {
            large?: string;
            medium?: string;
            original?: string;
        } | null;
        coverImage?: {
            large?: string;
            original?: string;
        } | null;
    };
}

interface KitsuUsersResponse {
    data: KitsuUserResource[];
}

export type { KitsuUserResource, KitsuUsersResponse };
