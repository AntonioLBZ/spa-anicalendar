import type { CalendarStats } from '@/lib/airing';

type CalendarToolbarProps = {
    /** Pending/next-airing stats. */
    stats: CalendarStats;
    /** Whether visibility edit mode is active. */
    isEditMode: boolean;
    /** Number of hidden entries. */
    hiddenCount: number;
    /** Shows the "explore current season" link. */
    showCurrentSeasonLink?: boolean;
    /** Shows the "explore next season" link. */
    showNextSeasonLink?: boolean;
};

export type { CalendarToolbarProps };
