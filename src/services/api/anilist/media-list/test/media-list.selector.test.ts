import { describe, expect, it } from 'vitest';

import { selectAnimeEntries } from '../media-list.selector';

import type { AnilistMediaListEntry } from '../media-list.types';

function baseEntry(overrides: Partial<AnilistMediaListEntry> = {}): AnilistMediaListEntry {
    return {
        id: 1,
        status: 'CURRENT',
        media: {
            coverImage: { medium: 'medium.jpg', large: 'large.jpg' },
            chapters: null,
            episodes: 12,
            duration: 24,
            status: 'RELEASING',
            nextAiringEpisode: { airingAt: 1700000000, episode: 5 },
            siteUrl: 'https://anilist.co/anime/1',
            title: { userPreferred: 'Test Anime' },
            endDate: { day: null, month: null, year: null },
            isAdult: false,
            season: 'FALL',
            seasonYear: 2026,
            format: 'TV',
            genres: ['Action'],
        },
        progress: 4,
        mediaId: 1,
        repeat: 0,
        ...overrides,
    };
}

describe('selectAnimeEntries', () => {
    it('maps seasonYear onto the resulting AnimeEntry', () => {
        const [entry] = selectAnimeEntries([baseEntry()]);

        expect(entry.seasonYear).toBe(2026);
    });

    it('leaves seasonYear undefined when AniList returns null', () => {
        const [entry] = selectAnimeEntries([
            baseEntry({ media: { ...baseEntry().media, seasonYear: null } }),
        ]);

        expect(entry.seasonYear).toBeUndefined();
    });

    describe('listStatus mapping (which requested list this entry came from)', () => {
        it('maps CURRENT to WATCHING', () => {
            const [entry] = selectAnimeEntries([baseEntry({ status: 'CURRENT' })]);
            expect(entry.listStatus).toBe('WATCHING');
        });

        it('maps REPEATING to WATCHING', () => {
            const [entry] = selectAnimeEntries([baseEntry({ status: 'REPEATING' })]);
            expect(entry.listStatus).toBe('WATCHING');
        });

        it('maps PLANNING to PLANNING', () => {
            const [entry] = selectAnimeEntries([baseEntry({ status: 'PLANNING' })]);
            expect(entry.listStatus).toBe('PLANNING');
        });

        it('leaves listStatus undefined for an unmapped status', () => {
            const [entry] = selectAnimeEntries([baseEntry({ status: 'COMPLETED' })]);
            expect(entry.listStatus).toBeUndefined();
        });
    });
});
