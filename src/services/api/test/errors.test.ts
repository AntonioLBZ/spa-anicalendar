import { describe, expect, it } from 'vitest';

import { AnilistUserNotFoundError } from '../anilist/client';
import { isUserNotFoundError } from '../errors';
import { KitsuUserNotFoundError } from '../kitsu/client';
import { MalUserNotFoundError } from '../mal/client';

describe('isUserNotFoundError', () => {
    it('returns true for each provider-specific not-found error', () => {
        expect(isUserNotFoundError(new AnilistUserNotFoundError())).toBe(true);
        expect(isUserNotFoundError(new KitsuUserNotFoundError())).toBe(true);
        expect(isUserNotFoundError(new MalUserNotFoundError())).toBe(true);
    });

    it('returns false for a generic error or a non-error value', () => {
        expect(isUserNotFoundError(new Error('network down'))).toBe(false);
        expect(isUserNotFoundError('not-found')).toBe(false);
        expect(isUserNotFoundError(null)).toBe(false);
    });
});
