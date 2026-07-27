import { describe, expect, it } from 'vitest';

import { getAiringMinuteOfDay, getWeeksUntilAiring } from '../calendar';

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

describe('getWeeksUntilAiring', () => {
    // Wednesday 2026-01-07, noon.
    const now = new Date(2026, 0, 7, 12, 0, 0);
    const toUnix = (date: Date) => Math.floor(date.getTime() / 1000);

    it('returns 0 for an airing time later this week', () => {
        const airingAt = toUnix(new Date(2026, 0, 9, 18, 0, 0));
        expect(getWeeksUntilAiring(airingAt, 'monday', now)).toBe(0);
    });

    it('returns 1 for an airing time exactly one week out (a skipped week)', () => {
        const airingAt = toUnix(new Date(2026, 0, 16, 18, 0, 0));
        expect(getWeeksUntilAiring(airingAt, 'monday', now)).toBe(1);
    });

    it('returns 2 for an airing time two weeks out', () => {
        const airingAt = toUnix(new Date(2026, 0, 23, 18, 0, 0));
        expect(getWeeksUntilAiring(airingAt, 'monday', now)).toBe(2);
    });

    it('respects a Sunday week start', () => {
        // Sunday 2026-01-04 through Saturday 2026-01-10 is "this week" when weeks start on Sunday.
        const sameWeek = toUnix(new Date(2026, 0, 10, 18, 0, 0));
        const nextWeek = toUnix(new Date(2026, 0, 11, 18, 0, 0));
        expect(getWeeksUntilAiring(sameWeek, 'sunday', now)).toBe(0);
        expect(getWeeksUntilAiring(nextWeek, 'sunday', now)).toBe(1);
    });
});
