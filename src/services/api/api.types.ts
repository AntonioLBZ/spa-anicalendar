import type { AnimeEntry, User } from '@/services/models';

type Provider = 'anilist' | 'kitsu' | 'myanimelist' | 'mock';

interface ApiProvider {
    getUserByName(name: string): Promise<User>;
    getMediaList(userId: number): Promise<AnimeEntry[]>;
}

export type { Provider, ApiProvider };
