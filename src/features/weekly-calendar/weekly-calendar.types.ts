import type { CalendarLayout, WeekStartDay } from '@/contexts/settings-context';
import type { AnimeEntry } from '@/services';

type WeeklyCalendarProps = {
    entries: AnimeEntry[];
};

type WeeklyCalendarDayProps = {
    dayIndex: number;
    entries: AnimeEntry[];
    isToday: boolean;
    weekStartDay: WeekStartDay;
    layout: CalendarLayout;
};

export type { WeeklyCalendarProps, WeeklyCalendarDayProps };
