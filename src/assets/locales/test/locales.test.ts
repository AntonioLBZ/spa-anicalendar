import { describe, expect, it } from 'vitest';

import de from '../de.json';
import en from '../en.json';
import es from '../es.json';
import fr from '../fr.json';

const locales = { en, es, fr, de };

function collectKeyPaths(obj: unknown, prefix = ''): string[] {
    if (typeof obj !== 'object' || obj === null) return [prefix];

    return Object.entries(obj as Record<string, unknown>).flatMap(([key, value]) =>
        collectKeyPaths(value, prefix ? `${prefix}.${key}` : key)
    );
}

describe('locale key parity', () => {
    const enKeys = collectKeyPaths(en).sort();

    it.each(Object.entries(locales).filter(([name]) => name !== 'en'))(
        'en.json and %s.json expose exactly the same set of keys',
        (_name, messages) => {
            expect(collectKeyPaths(messages).sort()).toEqual(enKeys);
        }
    );

    it.each(Object.entries(locales))('%s contains the anonymous-mode keys', (_name, messages) => {
        expect(messages.home.browseSeason).toBeTruthy();
        expect(messages.airing.seasonalDisclosure).toBeTruthy();
        expect(messages.airing.seasonalEmptyList).toBeTruthy();
    });
});
