interface KitsuUserResource {
    id: string;
    attributes: {
        name: string;
        slug: string;
        avatar: {
            medium?: string;
            original?: string;
        } | null;
    };
}

interface KitsuUsersResponse {
    data: KitsuUserResource[];
}

export type { KitsuUserResource, KitsuUsersResponse };
