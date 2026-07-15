import { describe, expect, it } from 'vitest';

import { getEntriesWithNextAiring } from '../airing';

import type { AnimeEntry } from '@/services';

function baseEntry(overrides: Partial<AnimeEntry> = {}): AnimeEntry {
    return {
        id: 1,
        mediaId: 1,
        title: 'Test Anime',
        coverImageUrl: '',
        status: 'RELEASING',
        siteUrl: '',
        endDate: {},
        isAdult: false,
        genres: [],
        progress: 0,
        repeat: 0,
        ...overrides,
    };
}

describe('getEntriesWithNextAiring', () => {
    it('marks the single entry with the soonest future airingAt as isNextAiring', () => {
        const now = Math.floor(Date.now() / 1000);
        const entries = [
            baseEntry({ id: 1, nextAiringEpisode: { airingAt: now + 3600, episode: 2 } }),
            baseEntry({ id: 2, nextAiringEpisode: { airingAt: now + 60, episode: 5 } }),
            baseEntry({ id: 3, nextAiringEpisode: { airingAt: now + 7200, episode: 1 } }),
        ];

        const result = getEntriesWithNextAiring(entries);

        expect(result.find((entry) => entry.id === 2)?.isNextAiring).toBe(true);
        expect(result.find((entry) => entry.id === 1)?.isNextAiring).toBeUndefined();
        expect(result.find((entry) => entry.id === 3)?.isNextAiring).toBeUndefined();
    });

    it('ignores entries with no nextAiringEpisode', () => {
        const now = Math.floor(Date.now() / 1000);
        const entries = [baseEntry({ id: 1 }), baseEntry({ id: 2, nextAiringEpisode: { airingAt: now + 60, episode: 1 } })];

        const result = getEntriesWithNextAiring(entries);

        expect(result.find((entry) => entry.id === 2)?.isNextAiring).toBe(true);
    });

    it('ignores entries whose episode has already aired', () => {
        const now = Math.floor(Date.now() / 1000);
        const entries = [baseEntry({ id: 1, nextAiringEpisode: { airingAt: now - 60, episode: 1 } })];

        const result = getEntriesWithNextAiring(entries);

        expect(result[0].isNextAiring).toBeUndefined();
    });

    it('returns the entries unchanged when none are upcoming', () => {
        const entries = [baseEntry({ id: 1 }), baseEntry({ id: 2 })];

        const result = getEntriesWithNextAiring(entries);

        expect(result).toEqual(entries);
    });
});
