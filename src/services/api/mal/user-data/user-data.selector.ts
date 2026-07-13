import type { MalUserResponse } from './user-data.types';
import type { User } from '@/services/models';

function hashUsername(name: string): number {
    let hash = 0;

    for (let i = 0; i < name.length; i += 1) {
        hash = (hash * 31 + name.charCodeAt(i)) | 0;
    }

    return Math.abs(hash);
}

const selectUser = (raw: MalUserResponse): User => ({
    id: hashUsername(raw.name),
    name: raw.name,
    avatarUrl: 'https://cdn.myanimelist.net/images/questionmark_50.gif',
    siteUrl: `https://myanimelist.net/profile/${raw.name}`,
});

export { selectUser };
