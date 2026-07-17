import { describe, expect, it } from 'vitest';

import { getCalendarStats, getCurrentSeason, getNextAiringEntryId } from '../airing';

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

describe('getNextAiringEntryId', () => {
    it('returns the id of the entry with the soonest future airingAt', () => {
        const now = Math.floor(Date.now() / 1000);
        const entries = [
            baseEntry({ id: 1, nextAiringEpisode: { airingAt: now + 3600, episode: 2 } }),
            baseEntry({ id: 2, nextAiringEpisode: { airingAt: now + 60, episode: 5 } }),
            baseEntry({ id: 3, nextAiringEpisode: { airingAt: now + 7200, episode: 1 } }),
        ];

        expect(getNextAiringEntryId(entries)).toBe(2);
    });

    it('ignores entries with no nextAiringEpisode', () => {
        const now = Math.floor(Date.now() / 1000);
        const entries = [baseEntry({ id: 1 }), baseEntry({ id: 2, nextAiringEpisode: { airingAt: now + 60, episode: 1 } })];

        expect(getNextAiringEntryId(entries)).toBe(2);
    });

    it('ignores entries whose episode has already aired', () => {
        const now = Math.floor(Date.now() / 1000);
        const entries = [baseEntry({ id: 1, nextAiringEpisode: { airingAt: now - 60, episode: 1 } })];

        expect(getNextAiringEntryId(entries)).toBeNull();
    });

    it('returns null when none are upcoming', () => {
        const entries = [baseEntry({ id: 1 }), baseEntry({ id: 2 })];

        expect(getNextAiringEntryId(entries)).toBeNull();
    });
});

describe('getCurrentSeason', () => {
    it('maps December to WINTER of the following year', () => {
        expect(getCurrentSeason(new Date(2026, 11, 15))).toEqual({ season: 'WINTER', seasonYear: 2027 });
    });

    it('maps January/February to WINTER of the same year', () => {
        expect(getCurrentSeason(new Date(2026, 0, 1))).toEqual({ season: 'WINTER', seasonYear: 2026 });
        expect(getCurrentSeason(new Date(2026, 1, 28))).toEqual({ season: 'WINTER', seasonYear: 2026 });
    });

    it('maps March-May to SPRING', () => {
        expect(getCurrentSeason(new Date(2026, 3, 1))).toEqual({ season: 'SPRING', seasonYear: 2026 });
    });

    it('maps June-August to SUMMER', () => {
        expect(getCurrentSeason(new Date(2026, 6, 1))).toEqual({ season: 'SUMMER', seasonYear: 2026 });
    });

    it('maps September-November to FALL', () => {
        expect(getCurrentSeason(new Date(2026, 9, 1))).toEqual({ season: 'FALL', seasonYear: 2026 });
    });
});

describe('getCalendarStats', () => {
    it('returns 0 pending (not NaN) when progress is undefined', () => {
        const entries = [
            baseEntry({
                id: 1,
                progress: undefined,
                duration: 24,
                nextAiringEpisode: { airingAt: Math.floor(Date.now() / 1000) + 3600, episode: 5 },
            }),
        ];

        const stats = getCalendarStats(entries);

        expect(stats.pendingEpisodes).toBe(0);
        expect(stats.pendingMinutes).toBe(0);
        expect(Number.isNaN(stats.pendingEpisodes)).toBe(false);
        expect(stats.nextAiringAt).not.toBeNull();
    });

    it('still computes pending episodes when progress is defined', () => {
        const entries = [
            baseEntry({
                id: 1,
                progress: 2,
                duration: 24,
                nextAiringEpisode: { airingAt: Math.floor(Date.now() / 1000) + 3600, episode: 5 },
            }),
        ];

        const stats = getCalendarStats(entries);

        expect(stats.pendingEpisodes).toBe(2);
        expect(stats.pendingMinutes).toBe(48);
    });
});
