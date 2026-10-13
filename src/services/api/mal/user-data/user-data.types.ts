interface MalUserResponse {
    name: string;
    /** Read from the public profile page by `/api/mal/user`; absent when the user has none. */
    avatarUrl?: string;
}

export type { MalUserResponse };
