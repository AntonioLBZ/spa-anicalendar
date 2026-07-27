import type { CalendarStats } from '@/lib/airing';

type CalendarToolbarProps = {
    /** Pending/next-airing stats. */
    stats: CalendarStats;
    /** Whether visibility edit mode is active. */
    isEditMode: boolean;
    /** Number of hidden entries. */
    hiddenCount: number;
    /** Shows the current/next season explore links. */
    showExploreLinks?: boolean;
};

export type { CalendarToolbarProps };
