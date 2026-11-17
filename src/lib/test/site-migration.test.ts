import { describe, expect, it, vi } from 'vitest';

import { MemoryStorage } from '@/lib/test/memory-storage';

import { buildMigrationUrl, importMigratedStorage, isLegacyHost } from '../site-migration';

const fakeLocation = (url: string) => {
    const parsed = new URL(url);
    return { pathname: parsed.pathname, search: parsed.search, hash: parsed.hash } as Location;
};

const fakeHistory = () => ({ state: null, replaceState: vi.fn() }) as unknown as History;

describe('site migration', () => {
    it('recognises the old domain only', () => {
        expect(isLegacyHost('anicalendar-lbz.vercel.app')).toBe(true);
        expect(isLegacyHost('anicalendar.albz.app')).toBe(false);
        expect(isLegacyHost('localhost:3000')).toBe(false);
    });

    it('keeps the path and query on the new domain', () => {
        const url = buildMigrationUrl(fakeLocation('https://old.test/es/airing/ñandú?provider=anilist'), null);

        expect(url).toBe('https://anicalendar.albz.app/es/airing/%C3%B1and%C3%BA?provider=anilist');
    });

    it('carries only the app keys and restores them on the new domain', () => {
        const source = new MemoryStorage();
        source.setItem('anicalendar-settings', JSON.stringify({ lastUsername: 'Ñandú', theme: 'dark' }));
        source.setItem('anicalendar-hidden-entries:anilist:x', '[1,2]');
        source.setItem('unrelated', 'secret');

        const url = buildMigrationUrl(fakeLocation('https://old.test/en'), source);
        const target = new MemoryStorage();
        const history = fakeHistory();

        const count = importMigratedStorage(fakeLocation(url), target, history);

        expect(count).toBe(2);
        expect(JSON.parse(target.getItem('anicalendar-settings')!)).toEqual({ lastUsername: 'Ñandú', theme: 'dark' });
        expect(target.getItem('anicalendar-hidden-entries:anilist:x')).toBe('[1,2]');
        expect(target.getItem('unrelated')).toBeNull();
        expect(history.replaceState).toHaveBeenCalledWith(null, '', '/en');
    });

    it("doesn't overwrite data already saved on the new domain", () => {
        const source = new MemoryStorage();
        source.setItem('anicalendar-settings', '"old"');
        const target = new MemoryStorage();
        target.setItem('anicalendar-settings', '"new"');

        importMigratedStorage(
            fakeLocation(buildMigrationUrl(fakeLocation('https://old.test/en'), source)),
            target,
            fakeHistory()
        );

        expect(target.getItem('anicalendar-settings')).toBe('"new"');
    });

    it('ignores a malformed payload but still cleans the address bar', () => {
        const target = new MemoryStorage();
        const history = fakeHistory();

        const count = importMigratedStorage(fakeLocation('https://new.test/en#migrate=%%%'), target, history);

        expect(count).toBe(0);
        expect(target.length).toBe(0);
        expect(history.replaceState).toHaveBeenCalled();
    });

    it('does nothing without a payload', () => {
        const history = fakeHistory();

        expect(importMigratedStorage(fakeLocation('https://new.test/en'), new MemoryStorage(), history)).toBe(0);
        expect(history.replaceState).not.toHaveBeenCalled();
    });
});
