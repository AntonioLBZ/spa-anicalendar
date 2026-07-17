import { describe, expect, it } from 'vitest';

import en from '../en.json';
import es from '../es.json';

function collectKeyPaths(obj: unknown, prefix = ''): string[] {
    if (typeof obj !== 'object' || obj === null) return [prefix];

    return Object.entries(obj as Record<string, unknown>).flatMap(([key, value]) =>
        collectKeyPaths(value, prefix ? `${prefix}.${key}` : key)
    );
}

describe('locale key parity', () => {
    it('en.json and es.json expose exactly the same set of keys', () => {
        const enKeys = collectKeyPaths(en).sort();
        const esKeys = collectKeyPaths(es).sort();

        expect(esKeys).toEqual(enKeys);
    });

    it('both locales contain the anonymous-mode keys', () => {
        expect(en.home.browseSeason).toBeTruthy();
        expect(es.home.browseSeason).toBeTruthy();
        expect(en.airing.seasonalDisclosure).toBeTruthy();
        expect(es.airing.seasonalDisclosure).toBeTruthy();
        expect(en.airing.seasonalEmptyList).toBeTruthy();
        expect(es.airing.seasonalEmptyList).toBeTruthy();
    });
});
