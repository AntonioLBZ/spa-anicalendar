import type { CalendarLayout, WeekStartDay } from '@/contexts/settings-context';
import type { EntryVisibilityControlsProps } from '@/features/entry-visibility';
import type { AnimeEntry } from '@/services';

/** `calendarLayout` with `'auto'` resolved away — the concrete layout actually being rendered. */
type ResolvedCalendarLayout = Exclude<CalendarLayout, 'auto'>;

type WeeklyCalendarProps = {
    entries: AnimeEntry[];
    isEditMode?: boolean;
    hiddenIds?: number[];
    onToggleEntry?: (id: number) => void;
    /** Whether cards render the "Ep X/Y" progress badge.
     * @default true
     */
    showProgress?: boolean;
    /** Whether cards render the "behind"/"caught up" watch-status indicator. Off for entries with no per-user list (e.g. seasonal browsing).
     * @default true
     */
    showWatchStatus?: boolean;
    /** Overrides the default "No anime in your watching list" empty-state copy, which is inaccurate outside a per-user list. */
    emptyMessage?: string;
    /** Edit-mode visibility controls + the seasonal filters trigger, rendered together at the right edge of the section header. Omit to hide both (e.g. no visibility management for this view). */
    visibility?: EntryVisibilityControlsProps;
};

type WeeklyCalendarDayProps = {
    dayIndex: number;
    entries: AnimeEntry[];
    isToday: boolean;
    weekStartDay: WeekStartDay;
    layout: ResolvedCalendarLayout;
    isEditMode?: boolean;
    hiddenIds?: number[];
    onToggleEntry?: (id: number) => void;
    nextAiringEntryId?: number | null;
    /** @default true */
    showProgress?: boolean;
    /** @default true */
    showWatchStatus?: boolean;
};

export type { WeeklyCalendarProps, WeeklyCalendarDayProps, ResolvedCalendarLayout };
