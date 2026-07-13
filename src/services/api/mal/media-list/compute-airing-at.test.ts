import { describe, expect, it } from 'vitest';

import { computeAiringAt } from './compute-airing-at';

describe('computeAiringAt', () => {
    it('rolls over to next week when now is the broadcast day but past start_time', () => {
        const now = new Date('2026-07-15T23:30:00+09:00');

        expect(computeAiringAt('wednesday', '23:00', now)).toBe(1784728800);
    });

    it('resolves the next occurrence this week when now is before the broadcast day', () => {
        const now = new Date('2026-07-13T12:00:00+09:00');

        expect(computeAiringAt('wednesday', '23:00', now)).toBe(1784124000);
    });

    it('resolves today when now is the broadcast day and before start_time', () => {
        const now = new Date('2026-07-15T10:00:00+09:00');

        expect(computeAiringAt('wednesday', '23:00', now)).toBe(1784124000);
    });

    it('resolves the next occurrence this week for a different weekday', () => {
        const now = new Date('2026-07-13T12:00:00+09:00');

        expect(computeAiringAt('friday', '20:00', now)).toBe(
            Math.floor(new Date('2026-07-17T20:00:00+09:00').getTime() / 1000),
        );
    });
});
