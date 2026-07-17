import type { CalendarStats } from '@/lib/airing';

type CalendarToolbarProps = {
    stats: CalendarStats;
    isEditMode: boolean;
    hiddenCount: number;
    onEnter: () => void;
    onSave: () => void;
    onCancel: () => void;
    /** Whether to render the pending-episodes/pending-time stat. Off for entries with no per-user list (e.g. anonymous seasonal browsing) — the stat would otherwise show a nonsensical "0 pending".
     * @default true
     */
    showPendingStats?: boolean;
};

export type { CalendarToolbarProps };
