import type { CalendarLayout, WeekStartDay } from '@/contexts/settings-context';
import type { AnimeEntry } from '@/services';

type WeeklyCalendarProps = {
    entries: AnimeEntry[];
    isEditMode?: boolean;
    hiddenIds?: number[];
    onToggleEntry?: (id: number) => void;
    /** Whether cards render per-user watch progress. Off for entries with no per-user list (e.g. anonymous seasonal browsing).
     * @default true
     */
    showProgress?: boolean;
    /** Overrides the default "No anime in your watching list" empty-state copy, which is inaccurate outside a per-user list. */
    emptyMessage?: string;
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
};

export type { WeeklyCalendarProps, WeeklyCalendarDayProps };
