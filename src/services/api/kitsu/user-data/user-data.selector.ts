import { DEFAULT_AVATAR_URL } from '../../shared';

import type { KitsuUserResource } from './user-data.types';
import type { User } from '@/services/models';

const selectUser = (raw: KitsuUserResource): User => ({
    id: Number(raw.id),
    name: raw.attributes.name,
    avatarUrl:
        raw.attributes.avatar?.large ??
        raw.attributes.avatar?.medium ??
        raw.attributes.avatar?.original ??
        DEFAULT_AVATAR_URL,
    siteUrl: `https://kitsu.app/users/${raw.id}`,
    bannerUrl: raw.attributes.coverImage?.large ?? raw.attributes.coverImage?.original ?? undefined,
});

export { selectUser };
