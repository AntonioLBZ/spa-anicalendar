import type { LayoutMode } from '@/lib/use-layout-mode';

type GridConfig = {
    columns: number;
    cssVariables: Record<string, string | number>;
};

const getGridConfigForLayout = (layout: LayoutMode, visibleDaysCount: number): GridConfig => {
    switch (layout) {
        case 'mobile':
            return {
                columns: 2,
                cssVariables: {
                    '--columns': 2,
                },
            };

        case 'tablet':
            return {
                columns: 4,
                cssVariables: {
                    '--columns': 4,
                },
            };

        case 'desktop':
            return {
                columns: visibleDaysCount,
                cssVariables: {
                    '--columns': visibleDaysCount,
                },
            };

        default:
            const _: never = layout;
            return _;
    }
};

export type { GridConfig };
export { getGridConfigForLayout };
