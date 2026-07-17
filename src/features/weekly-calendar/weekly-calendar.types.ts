import type { CalendarLayout, WeekStartDay } from '@/contexts/settings-context';
import type { AnimeEntry } from '@/services';

type WeeklyCalendarProps = {
    entries: AnimeEntry[];
    isEditMode?: boolean;
    hiddenIds?: number[];
    onToggleEntry?: (id: number) => void;
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
};

export type { WeeklyCalendarProps, WeeklyCalendarDayProps };
