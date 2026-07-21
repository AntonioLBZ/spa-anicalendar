import { describe, expect, it } from 'vitest';

import { selectSeasonalEntries } from '../seasonal.selector';

import type { AnilistSeasonalMedia } from '../seasonal.types';

function baseMedia(overrides: Partial<AnilistSeasonalMedia> = {}): AnilistSeasonalMedia {
    return {
        id: 42,
        coverImage: { medium: 'medium.jpg', large: 'large.jpg' },
        chapters: null,
        episodes: 12,
        duration: 24,
        status: 'RELEASING',
        nextAiringEpisode: { airingAt: 1700000000, episode: 5 },
        siteUrl: 'https://anilist.co/anime/42',
        title: { userPreferred: 'Test Anime' },
        endDate: { day: null, month: null, year: null },
        isAdult: false,
        season: 'FALL',
        seasonYear: 2026,
        genres: ['Action'],
        ...overrides,
    };
}

describe('selectSeasonalEntries', () => {
    it('synthesizes id and mediaId from media.id, and omits repeat', () => {
        const [entry] = selectSeasonalEntries([baseMedia({ id: 42 })]);

        expect(entry.id).toBe(42);
        expect(entry.mediaId).toBe(42);
        expect(entry.id).toBe(entry.mediaId);
        expect(entry.repeat).toBeUndefined();
    });

    it('sets progress to episodes already aired (nextAiringEpisode.episode - 1)', () => {
        const [entry] = selectSeasonalEntries([baseMedia()]);

        expect(entry.progress).toBe(4);
    });

    it('leaves progress undefined when there is no nextAiringEpisode', () => {
        const [entry] = selectSeasonalEntries([baseMedia({ nextAiringEpisode: null })]);

        expect(entry.progress).toBeUndefined();
    });

    it('maps the rest of the fields the same way the per-user selector does', () => {
        const [entry] = selectSeasonalEntries([baseMedia()]);

        expect(entry.title).toBe('Test Anime');
        expect(entry.coverImageUrl).toBe('large.jpg');
        expect(entry.status).toBe('RELEASING');
        expect(entry.nextAiringEpisode).toEqual({ airingAt: 1700000000, episode: 5 });
        expect(entry.isAdult).toBe(false);
        expect(entry.genres).toEqual(['Action']);
        expect(entry.season).toBe('FALL');
        expect(entry.seasonYear).toBe(2026);
    });
});
