import type { CalendarLayout, WeekStartDay } from '@/contexts/settings-context';
import type { AnimeEntry } from '@/services';

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
    /** Rendered at the right edge of the main section header row (e.g. a seasonal filters trigger). */
    sectionHeaderAction?: React.ReactNode;
};

type WeeklyCalendarDayProps = {
    dayIndex: number;
    entries: AnimeEntry[];
    isToday: boolean;
    weekStartDay: WeekStartDay;
    layout: CalendarLayout;
    isEditMode?: boolean;
    hiddenIds?: number[];
    onToggleEntry?: (id: number) => void;
    nextAiringEntryId?: number | null;
    /** @default true */
    showProgress?: boolean;
    /** @default true */
    showWatchStatus?: boolean;
};

export type { WeeklyCalendarProps, WeeklyCalendarDayProps };
