import { describe, expect, it } from 'vitest';

import { DEFAULT_AVATAR_URL } from '../../../shared';
import { selectUser } from '../user-data.selector';

import type { AnilistUserResponse } from '../user-data.types';

function baseResponse(overrides: Partial<AnilistUserResponse['User']> = {}): AnilistUserResponse {
    return {
        User: {
            id: 42,
            name: 'lanzorzx',
            avatar: { medium: 'https://s4.anilist.co/file/anilistcdn/user/avatar/medium/42.png' },
            siteUrl: 'https://anilist.co/user/lanzorzx',
            ...overrides,
        },
    };
}

describe('selectUser', () => {
    it('maps id, name, siteUrl and avatarUrl from the response', () => {
        const user = selectUser(baseResponse());

        expect(user).toEqual({
            id: 42,
            name: 'lanzorzx',
            avatarUrl: 'https://s4.anilist.co/file/anilistcdn/user/avatar/medium/42.png',
            siteUrl: 'https://anilist.co/user/lanzorzx',
        });
    });

    it('falls back to the shared default avatar when avatar.medium is null', () => {
        const user = selectUser(baseResponse({ avatar: { medium: null } }));

        expect(user.avatarUrl).toBe(DEFAULT_AVATAR_URL);
    });

    it('falls back to the shared default avatar when avatar itself is null', () => {
        const user = selectUser(baseResponse({ avatar: null }));

        expect(user.avatarUrl).toBe(DEFAULT_AVATAR_URL);
    });
});
