interface User {
    id: number;
    name: string;
    avatarUrl: string;
    siteUrl: string;
    /** Profile banner, when the provider has one (AniList banner, Kitsu cover image). */
    bannerUrl?: string;
    /** AniList profile color: one of its preset names (`blue`, `purple`, …) or a supporter's custom hex. */
    profileColor?: string;
}

export type { User };
