import type { AnimeEntry, User } from '@/services/models';

type Provider = 'anilist' | 'mal';

interface ApiProvider {
    getUserByName(name: string): Promise<User>;
    getMediaList(userId: number): Promise<AnimeEntry[]>;
}

export type { Provider, ApiProvider };
