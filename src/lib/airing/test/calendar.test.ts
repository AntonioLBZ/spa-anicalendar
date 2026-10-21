import { describe, expect, it } from 'vitest';

import { getAiringMinuteOfDay, getWeeksUntilAiring, isAiringToday } from '../calendar';

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

    it('returns 0 for an airing time later this calendar week', () => {
        const airingAt = toUnix(new Date(2026, 0, 9, 18, 0, 0));
        expect(getWeeksUntilAiring(airingAt, now)).toBe(0);
    });

    it('returns 0 when exactly 7 days away, even if it falls in the next calendar week', () => {
        // Wednesday -> next Wednesday is a calendar-week skip, but only 7 days out.
        const airingAt = toUnix(new Date(2026, 0, 14, 18, 0, 0));
        expect(getWeeksUntilAiring(airingAt, now)).toBe(0);
    });

    it('returns 1 when more than 7 days away', () => {
        const airingAt = toUnix(new Date(2026, 0, 16, 18, 0, 0));
        expect(getWeeksUntilAiring(airingAt, now)).toBe(1);
    });

    it('returns 2 for an airing time two weeks out', () => {
        const airingAt = toUnix(new Date(2026, 0, 23, 18, 0, 0));
        expect(getWeeksUntilAiring(airingAt, now)).toBe(2);
    });

    it('counts one skipped week when the same weekday is 14 days away', () => {
        const airingAt = toUnix(new Date(2026, 0, 21, 18, 0, 0));
        expect(getWeeksUntilAiring(airingAt, now)).toBe(1);
    });

    it('counts two skipped weeks when the same weekday is 21 days away', () => {
        const airingAt = toUnix(new Date(2026, 0, 28, 18, 0, 0));
        expect(getWeeksUntilAiring(airingAt, now)).toBe(2);
    });
});

describe('isAiringToday', () => {
    // Wednesday 2026-01-07, 15:00.
    const now = new Date(2026, 0, 7, 15, 0, 0);
    const toUnix = (date: Date) => Math.floor(date.getTime() / 1000);

    it('is true for any time on the same local date, earlier or later than now', () => {
        expect(isAiringToday(toUnix(new Date(2026, 0, 7, 23, 30)), now)).toBe(true);
        expect(isAiringToday(toUnix(new Date(2026, 0, 7, 0, 5)), now)).toBe(true);
    });

    it('is false for the same weekday next week, i.e. an episode that already aired today', () => {
        expect(isAiringToday(toUnix(new Date(2026, 0, 14, 10, 0)), now)).toBe(false);
    });
});
