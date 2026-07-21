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
    /** Whether this toolbar is for the anonymous seasonal calendar rather than a per-user list. Swaps the hint copy.
     * @default false
     */
    isSeasonal?: boolean;
    /** Whether every eligible entry is currently hidden in the edit-mode draft — drives the "hide all"/"show all" toggle label. */
    isAllHidden?: boolean;
    /** Toggles all eligible entries between fully hidden and fully visible in the edit-mode draft. Omit to hide the button. */
    onToggleAll?: () => void;
};

export type { CalendarToolbarProps };
