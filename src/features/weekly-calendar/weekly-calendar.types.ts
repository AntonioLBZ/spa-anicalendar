import type { WeekStartDay } from '@/contexts/settings-context';
import type { AnimeEntry } from '@/services';

type WeeklyCalendarProps = {
    entries: AnimeEntry[];
};

type WeeklyCalendarDayProps = {
    dayIndex: number;
    entries: AnimeEntry[];
    isToday: boolean;
    collapseContent: boolean;
    weekStartDay: WeekStartDay;
};

export type { WeeklyCalendarProps, WeeklyCalendarDayProps };
