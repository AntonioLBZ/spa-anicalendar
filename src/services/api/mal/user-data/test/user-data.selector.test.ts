import { describe, expect, it } from 'vitest';

import { DEFAULT_AVATAR_URL } from '../../../shared';
import { selectUser } from '../user-data.selector';

describe('selectUser', () => {
    it('maps name and derives siteUrl/avatarUrl deterministically', () => {
        const user = selectUser({ name: 'lanzorzx' });

        expect(user.name).toBe('lanzorzx');
        expect(user.siteUrl).toBe('https://myanimelist.net/profile/lanzorzx');
        expect(user.avatarUrl).toBe(DEFAULT_AVATAR_URL);
    });

    it('derives a stable, non-negative integer id from the name', () => {
        const first = selectUser({ name: 'lanzorzx' });
        const second = selectUser({ name: 'lanzorzx' });

        expect(first.id).toBe(second.id);
        expect(Number.isInteger(first.id)).toBe(true);
        expect(first.id).toBeGreaterThanOrEqual(0);
    });

    it('derives different ids for different names', () => {
        const a = selectUser({ name: 'lanzorzx' });
        const b = selectUser({ name: 'someoneelse' });

        expect(a.id).not.toBe(b.id);
    });
});
