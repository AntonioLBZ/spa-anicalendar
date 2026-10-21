import { describe, expect, it } from 'vitest';

import { isProviderEnabled, parseEnabledProviders } from '../options';

describe('parseEnabledProviders', () => {
    it('defaults to AniList when the variable is not set', () => {
        expect(parseEnabledProviders(undefined)).toEqual(['anilist']);
    });

    it('keeps the listed providers, ignoring spacing and case', () => {
        expect(parseEnabledProviders(' Kitsu , anilist ')).toEqual(['anilist', 'kitsu']);
    });

    it('falls back to the default when the value is empty or has no known provider', () => {
        expect(parseEnabledProviders('')).toEqual(['anilist']);
        expect(parseEnabledProviders('simkl,')).toEqual(['anilist']);
    });
});

describe('isProviderEnabled', () => {
    it('rejects values outside the allowlist', () => {
        expect(isProviderEnabled('anilist')).toBe(true);
        expect(isProviderEnabled('myanimelist')).toBe(false);
        expect(isProviderEnabled(undefined)).toBe(false);
    });
});
