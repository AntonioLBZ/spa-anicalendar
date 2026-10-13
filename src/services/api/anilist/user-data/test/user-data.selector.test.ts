import { describe, expect, it } from 'vitest';

import { DEFAULT_AVATAR_URL } from '../../../shared';
import { selectUser } from '../user-data.selector';

import type { AnilistUserResponse } from '../user-data.types';

function baseResponse(overrides: Partial<AnilistUserResponse['User']> = {}): AnilistUserResponse {
    return {
        User: {
            id: 42,
            name: 'lanzorzx',
            avatar: {
                large: 'https://s4.anilist.co/file/anilistcdn/user/avatar/large/42.png',
                medium: 'https://s4.anilist.co/file/anilistcdn/user/avatar/medium/42.png',
            },
            bannerImage: 'https://s4.anilist.co/file/anilistcdn/user/banner/42.jpg',
            options: { profileColor: 'purple' },
            siteUrl: 'https://anilist.co/user/lanzorzx',
            ...overrides,
        },
    };
}

describe('selectUser', () => {
    it('maps id, name, siteUrl, the large avatar, banner and profile color from the response', () => {
        const user = selectUser(baseResponse());

        expect(user).toEqual({
            id: 42,
            name: 'lanzorzx',
            avatarUrl: 'https://s4.anilist.co/file/anilistcdn/user/avatar/large/42.png',
            siteUrl: 'https://anilist.co/user/lanzorzx',
            bannerUrl: 'https://s4.anilist.co/file/anilistcdn/user/banner/42.jpg',
            profileColor: 'purple',
        });
    });

    it('leaves banner and profile color undefined when the user has none', () => {
        const user = selectUser(baseResponse({ bannerImage: null, options: null }));

        expect(user.bannerUrl).toBeUndefined();
        expect(user.profileColor).toBeUndefined();
    });

    it('falls back to the medium avatar when there is no large one', () => {
        const user = selectUser(baseResponse({ avatar: { large: null, medium: 'medium.png' } }));

        expect(user.avatarUrl).toBe('medium.png');
    });

    it('falls back to the shared default avatar when both avatar sizes are null', () => {
        const user = selectUser(baseResponse({ avatar: { large: null, medium: null } }));

        expect(user.avatarUrl).toBe(DEFAULT_AVATAR_URL);
    });

    it('falls back to the shared default avatar when avatar itself is null', () => {
        const user = selectUser(baseResponse({ avatar: null }));

        expect(user.avatarUrl).toBe(DEFAULT_AVATAR_URL);
    });
});
