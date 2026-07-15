import { DEFAULT_AVATAR_URL } from '../../shared';

import type { KitsuUserResource } from './user-data.types';
import type { User } from '@/services/models';

const selectUser = (raw: KitsuUserResource): User => ({
    id: Number(raw.id),
    name: raw.attributes.name,
    avatarUrl: raw.attributes.avatar?.medium ?? raw.attributes.avatar?.original ?? DEFAULT_AVATAR_URL,
    siteUrl: `https://kitsu.io/users/${raw.attributes.slug}`,
});

export { selectUser };
