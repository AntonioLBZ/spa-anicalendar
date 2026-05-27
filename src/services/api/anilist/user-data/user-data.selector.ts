import type { AnilistUserResponse } from './user-data.types';
import type { User } from '@/services/models';


const selectUser = (raw: AnilistUserResponse): User => ({
    id: raw.User.id,
    name: raw.User.name,
    avatarUrl: raw.User.avatar.medium,
    siteUrl: raw.User.siteUrl,
});

export { selectUser };
