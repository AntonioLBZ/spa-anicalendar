import type { LayoutMode } from '@/lib/use-layout-mode';

type GridConfig = {
    columns: number;
    minSizeColumns: string;
    cssVariables: Record<string, string | number>;
};

const getMinSizeColumnsTemplate = (days: Array<[string, unknown[]]>): string => {
    return days.reduce((acc, [, entries]) => acc + (Array.isArray(entries) && entries.length ? '1fr ' : 'min-content '), '');
};

const getGridConfigForLayout = (
    layout: LayoutMode,
    visibleDaysCount: number,
    minSizeColumns: string
): GridConfig => {
    switch (layout) {
        case 'mobile':
            return {
                columns: 2,
                minSizeColumns: 'repeat(2, 1fr)',
                cssVariables: {
                    '--columns': 2,
                    '--min-size-columns': 'repeat(2, 1fr)',
                },
            };

        case 'tablet':
            return {
                columns: 4,
                minSizeColumns: 'repeat(4, 1fr)',
                cssVariables: {
                    '--columns': 4,
                    '--min-size-columns': 'repeat(4, 1fr)',
                },
            };

        case 'desktop':
            return {
                columns: visibleDaysCount,
                minSizeColumns,
                cssVariables: {
                    '--columns': visibleDaysCount,
                    '--min-size-columns': minSizeColumns,
                },
            };

        default:
            const _: never = layout;
            return _;
    }
};

export type { GridConfig };
export { getGridConfigForLayout, getMinSizeColumnsTemplate };
