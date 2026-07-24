import { describe, expect, it } from 'vitest';

import { DEFAULT_AVATAR_URL } from '@/services/api/shared';

import { selectUser } from '../user-data.selector';

import type { KitsuUserResource } from '../user-data.types';

describe('selectUser', () => {
    it('maps id, name, siteUrl and avatarUrl from the JSON:API resource', () => {
        const raw: KitsuUserResource = {
            id: '42',
            attributes: {
                name: 'lanzorzx',
                avatar: { medium: 'https://media.kitsu.io/users/avatars/42/medium.jpg' },
            },
        };

        const user = selectUser(raw);

        expect(user.id).toBe(42);
        expect(user.name).toBe('lanzorzx');
        expect(user.siteUrl).toBe('https://kitsu.app/users/42');
        expect(user.avatarUrl).toBe('https://media.kitsu.io/users/avatars/42/medium.jpg');
    });

    it('converts the JSON:API string id to a number', () => {
        const raw: KitsuUserResource = {
            id: '123',
            attributes: { name: 'someone', avatar: null },
        };

        const user = selectUser(raw);

        expect(user.id).toBe(123);
        expect(Number.isInteger(user.id)).toBe(true);
    });

    it('falls back to the original avatar when medium is missing', () => {
        const raw: KitsuUserResource = {
            id: '7',
            attributes: {
                name: 'someone',
                avatar: { original: 'https://media.kitsu.io/users/avatars/7/original.jpg' },
            },
        };

        const user = selectUser(raw);

        expect(user.avatarUrl).toBe('https://media.kitsu.io/users/avatars/7/original.jpg');
    });

    it('falls back to the shared default avatar when no avatar is present', () => {
        const raw: KitsuUserResource = {
            id: '7',
            attributes: { name: 'someone', avatar: null },
        };

        const user = selectUser(raw);

        expect(user.avatarUrl).toBe(DEFAULT_AVATAR_URL);
    });
});
