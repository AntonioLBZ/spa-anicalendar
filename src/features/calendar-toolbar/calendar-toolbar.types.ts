import type { SeasonalFiltersState } from '@/features/seasonal-filters';
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
    /** Whether this toolbar is for the anonymous seasonal calendar rather than a per-user list. Swaps the hint copy and reveals the seasonal filters row.
     * @default false
     */
    isSeasonal?: boolean;
    /** Whether every eligible entry is currently hidden in the edit-mode draft — drives the "hide all"/"show all" toggle label. */
    isAllHidden?: boolean;
    /** Toggles all eligible entries between fully hidden and fully visible in the edit-mode draft. Omit to hide the button. */
    onToggleAll?: () => void;
    /** Current (persisted) seasonal filters. Required together with `onSeasonalFiltersSubmit` to render the filters row — only meaningful when `isSeasonal` is true. */
    seasonalFiltersValue?: SeasonalFiltersState;
    /** Applies a new set of seasonal filters (triggers a refetch). Called only on explicit form submit, not per-field change. */
    onSeasonalFiltersSubmit?: (next: SeasonalFiltersState) => void;
    /** Whether the persisted seasonal filters have finished loading from storage. */
    isSeasonalFiltersHydrated?: boolean;
};

export type { CalendarToolbarProps };
