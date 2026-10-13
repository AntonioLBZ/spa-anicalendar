import { afterEach, describe, expect, it, vi } from 'vitest';

import { formatCountdown, getLocalAiringTime, getTimeUntilAiring } from '../countdown';

describe('getLocalAiringTime', () => {
    const timestamp = Math.floor(new Date(2026, 3, 7, 14, 5).getTime() / 1000);

    it('formats in 24h notation by default', () => {
        expect(getLocalAiringTime(timestamp)).toContain('14:05');
    });

    // Day-period marker is locale-dependent (PM, p. m., 午後…), so only the hour is asserted
    it('formats in 12h notation when timeFormat is "12h"', () => {
        const result = getLocalAiringTime(timestamp, '12h');
        expect(result).not.toContain('14:');
        expect(result).toContain('02:05');
    });
});

describe('getTimeUntilAiring', () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it('returns unit "aired" when airingAt is now or in the past', () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date(2026, 0, 1, 12, 0, 0));
        const now = Math.floor(Date.now() / 1000);

        expect(getTimeUntilAiring(now)).toEqual({ unit: 'aired' });
        expect(getTimeUntilAiring(now - 60)).toEqual({ unit: 'aired' });
    });

    it('returns days+hours when more than a day away', () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date(2026, 0, 1, 12, 0, 0));
        const now = Math.floor(Date.now() / 1000);

        expect(getTimeUntilAiring(now + 2 * 86400 + 3 * 3600)).toEqual({ unit: 'days', days: 2, hours: 3 });
    });

    it('returns hours+minutes when less than a day but more than an hour away', () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date(2026, 0, 1, 12, 0, 0));
        const now = Math.floor(Date.now() / 1000);

        expect(getTimeUntilAiring(now + 5 * 3600 + 20 * 60)).toEqual({ unit: 'hours', hours: 5, minutes: 20 });
    });

    it('returns minutes when less than an hour away', () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date(2026, 0, 1, 12, 0, 0));
        const now = Math.floor(Date.now() / 1000);

        expect(getTimeUntilAiring(now + 45 * 60)).toEqual({ unit: 'minutes', minutes: 45 });
    });
});

describe('formatCountdown', () => {
    const t = vi.fn((key: string, values?: Record<string, number>) =>
        values ? `${key}:${JSON.stringify(values)}` : key
    );

    it('formats each countdown unit via the translator', () => {
        expect(formatCountdown(t, { unit: 'aired' })).toBe('aired');
        expect(formatCountdown(t, { unit: 'days', days: 2, hours: 3 })).toBe('countdownDays:{"days":2,"hours":3}');
        expect(formatCountdown(t, { unit: 'hours', hours: 5, minutes: 20 })).toBe(
            'countdownHours:{"hours":5,"minutes":20}'
        );
        expect(formatCountdown(t, { unit: 'minutes', minutes: 45 })).toBe('countdownMinutes:{"minutes":45}');
    });
});
