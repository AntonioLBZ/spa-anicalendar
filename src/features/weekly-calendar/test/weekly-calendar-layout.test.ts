import { describe, expect, it } from 'vitest';

import { getGridConfigForLayout } from '../weekly-calendar-layout';

describe('getGridConfigForLayout', () => {
    it('returns 2 columns for mobile', () => {
        const config = getGridConfigForLayout('mobile', 7);

        expect(config.columns).toBe(2);
        expect(config.cssVariables['--columns']).toBe(2);
    });

    it('returns 4 columns for tablet', () => {
        const config = getGridConfigForLayout('tablet', 7);

        expect(config.columns).toBe(4);
        expect(config.cssVariables['--columns']).toBe(4);
    });

    it('returns visibleDaysCount columns for desktop', () => {
        const config = getGridConfigForLayout('desktop', 5);

        expect(config.columns).toBe(5);
        expect(config.cssVariables['--columns']).toBe(5);
    });

    it('does not include minSizeColumns or --min-size-columns for any layout', () => {
        const layouts = ['mobile', 'tablet', 'desktop'] as const;

        for (const layout of layouts) {
            const config = getGridConfigForLayout(layout, 7);

            expect(config).not.toHaveProperty('minSizeColumns');
            expect(config.cssVariables).not.toHaveProperty('--min-size-columns');
        }
    });
});
