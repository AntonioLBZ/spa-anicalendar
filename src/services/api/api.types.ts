import type { AnimeEntry, MediaFormat, MediaListEntryStatus, User } from '@/services/models';

type Provider = 'anilist' | 'kitsu' | 'myanimelist';

interface MediaListFilters {
    formats: MediaFormat[];
    onlyNewSeason: boolean;
}

interface ApiProvider {
    getUserByName(name: string): Promise<User>;
    getMediaList(user: User, statuses: MediaListEntryStatus[], filters?: MediaListFilters): Promise<AnimeEntry[]>;
}

export type { Provider, ApiProvider, MediaListFilters };
