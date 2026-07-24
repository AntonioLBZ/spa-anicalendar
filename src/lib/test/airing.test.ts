import { describe, expect, it } from 'vitest';

import {
    deriveSeasonFromDate,
    finishedInCurrentSeason,
    getAiringMinuteOfDay,
    getCalendarStats,
    getCurrentSeason,
    getNextAiringEntryId,
    isFinishedInCurrentSeason,
    startedInCurrentSeason,
} from '../airing';

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

describe('getAiringMinuteOfDay', () => {
    it('returns the local minute-of-day for a timestamp', () => {
        const morning = new Date(2026, 3, 7, 9, 15);
        const evening = new Date(2026, 3, 14, 20, 30);

        expect(getAiringMinuteOfDay(Math.floor(morning.getTime() / 1000))).toBe(9 * 60 + 15);
        expect(getAiringMinuteOfDay(Math.floor(evening.getTime() / 1000))).toBe(20 * 60 + 30);
    });

    it('ranks by time of day even when absolute epoch ordering disagrees across weeks', () => {
        // Same weekday, different calendar weeks: a later time this week has an earlier epoch
        // than an earlier time next week — entries grouped by weekday alone (see getAiringDay)
        // must not be ordered by raw epoch, or "this week 18:35" would sort before "next week 13:30".
        const laterTimeThisWeek = Math.floor(new Date(2026, 3, 7, 18, 35).getTime() / 1000);
        const earlierTimeNextWeek = Math.floor(new Date(2026, 3, 14, 13, 30).getTime() / 1000);

        expect(laterTimeThisWeek).toBeLessThan(earlierTimeNextWeek);
        expect(getAiringMinuteOfDay(earlierTimeNextWeek)).toBeLessThan(getAiringMinuteOfDay(laterTimeThisWeek));
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

describe('deriveSeasonFromDate', () => {
    it('maps December to WINTER of the following year (matches getCurrentSeason)', () => {
        expect(deriveSeasonFromDate(new Date(2026, 11, 15))).toEqual({ season: 'WINTER', seasonYear: 2027 });
    });

    it('agrees with getCurrentSeason for a non-boundary date', () => {
        const date = new Date(2026, 6, 1);
        expect(deriveSeasonFromDate(date)).toEqual(getCurrentSeason(date));
    });
});

describe('startedInCurrentSeason', () => {
    const now = new Date(2026, 3, 1); // SPRING 2026

    it('is true when season/seasonYear match the current season', () => {
        const entry = baseEntry({ season: 'SPRING', seasonYear: 2026 });
        expect(startedInCurrentSeason(entry, now)).toBe(true);
    });

    it('is true for a 1-episode entry with no endDate but matching season/seasonYear', () => {
        const entry = baseEntry({ season: 'SPRING', seasonYear: 2026, endDate: {}, episodes: 1 });
        expect(startedInCurrentSeason(entry, now)).toBe(true);
    });

    it('is false when season/seasonYear are missing', () => {
        const entry = baseEntry({ season: undefined, seasonYear: undefined });
        expect(startedInCurrentSeason(entry, now)).toBe(false);
    });

    it('is false when season does not match the current season', () => {
        const entry = baseEntry({ season: 'FALL', seasonYear: 2025 });
        expect(startedInCurrentSeason(entry, now)).toBe(false);
    });
});

describe('finishedInCurrentSeason', () => {
    const now = new Date(2026, 3, 1); // SPRING 2026

    it('is true for a 2-cour show that started in an earlier season but ends in the current season', () => {
        const entry = baseEntry({
            season: 'FALL',
            seasonYear: 2025,
            endDate: { day: 15, month: 4, year: 2026 },
        });

        expect(startedInCurrentSeason(entry, now)).toBe(false);
        expect(finishedInCurrentSeason(entry, now)).toBe(true);
    });

    it('works via endDate alone for MAL-style entries (season reflects only the start)', () => {
        const entry = baseEntry({
            season: 'WINTER',
            seasonYear: 2026,
            endDate: { day: 1, month: 5, year: 2026 },
        });

        expect(finishedInCurrentSeason(entry, now)).toBe(true);
    });

    it('works via endDate alone for Kitsu-style entries with no season/seasonYear at all', () => {
        const entry = baseEntry({
            season: undefined,
            seasonYear: undefined,
            endDate: { day: 20, month: 3, year: 2026 },
        });

        expect(finishedInCurrentSeason(entry, now)).toBe(true);
    });

    it('handles the December boundary: endDate in December resolves to next year WINTER', () => {
        const decemberNow = new Date(2026, 11, 10); // WINTER 2027
        const entry = baseEntry({ endDate: { day: 25, month: 12, year: 2026 } });

        expect(finishedInCurrentSeason(entry, decemberNow)).toBe(true);
    });

    it('is false when endDate has no overlap with the current season', () => {
        const entry = baseEntry({
            season: 'FALL',
            seasonYear: 2025,
            endDate: { day: 1, month: 10, year: 2025 },
        });

        expect(finishedInCurrentSeason(entry, now)).toBe(false);
    });

    it('is false (not throwing) when endDate is only partially resolved', () => {
        const entry = baseEntry({ endDate: { year: 2026 } });
        expect(finishedInCurrentSeason(entry, now)).toBe(false);
    });

    it('is false (not throwing) when endDate is entirely missing', () => {
        const entry = baseEntry({ endDate: {} });
        expect(finishedInCurrentSeason(entry, now)).toBe(false);
    });
});

describe('isFinishedInCurrentSeason', () => {
    const now = new Date(2026, 3, 1); // SPRING 2026

    it('is true for a finished entry that started in the current season', () => {
        const entry = baseEntry({ status: 'FINISHED', season: 'SPRING', seasonYear: 2026, endDate: {} });
        expect(isFinishedInCurrentSeason(entry, now)).toBe(true);
    });

    it('is true for a finished 2-cour entry that only overlaps via endDate', () => {
        const entry = baseEntry({
            status: 'FINISHED',
            season: 'FALL',
            seasonYear: 2025,
            endDate: { day: 15, month: 4, year: 2026 },
        });
        expect(isFinishedInCurrentSeason(entry, now)).toBe(true);
    });

    it('is false when neither start nor end season overlaps with the current season', () => {
        const entry = baseEntry({
            status: 'FINISHED',
            season: 'FALL',
            seasonYear: 2025,
            endDate: { day: 1, month: 10, year: 2025 },
        });
        expect(isFinishedInCurrentSeason(entry, now)).toBe(false);
    });

    it('is false when the entry is not FINISHED, even if the season matches', () => {
        const entry = baseEntry({ status: 'RELEASING', season: 'SPRING', seasonYear: 2026, endDate: {} });
        expect(isFinishedInCurrentSeason(entry, now)).toBe(false);
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
