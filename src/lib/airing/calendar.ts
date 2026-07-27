import type { WeekStartDay } from '@/contexts/settings-context';

type DayKey = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

/** Day of week for a Unix timestamp (0 = weekStartDay). */
const getAiringDay = (airingAt: number, weekStartDay: WeekStartDay = 'monday'): number => {
    const jsDay = new Date(airingAt * 1000).getDay();

    if (weekStartDay === 'sunday') {
        return jsDay;
    }

    return jsDay === 0 ? 6 : jsDay - 1;
};

/** Local minute-of-day (0-1439) for a Unix timestamp. */
const getAiringMinuteOfDay = (airingAt: number): number => {
    const date = new Date(airingAt * 1000);
    return date.getHours() * 60 + date.getMinutes();
};

/** i18n day key for a dayIndex (0 = weekStartDay). */
const getDayKey = (dayIndex: number, weekStartDay: WeekStartDay = 'monday'): DayKey => {
    const mondayFirst: DayKey[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const sundayFirst: DayKey[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    const days = weekStartDay === 'sunday' ? sundayFirst : mondayFirst;
    return days[dayIndex];
};

/** Today's day index (0 = weekStartDay). */
const getTodayIndex = (weekStartDay: WeekStartDay = 'monday'): number => {
    const jsDay = new Date().getDay();

    if (weekStartDay === 'sunday') {
        return jsDay;
    }

    return jsDay === 0 ? 6 : jsDay - 1;
};

/** Full calendar weeks ahead `airingAt` falls, relative to the current week (0 = this week). */
const getWeeksUntilAiring = (
    airingAt: number,
    weekStartDay: WeekStartDay = 'monday',
    now: Date = new Date()
): number => {
    const jsDay = now.getDay();
    let todayIndex = jsDay;
    if (weekStartDay !== 'sunday') {
        todayIndex = jsDay === 0 ? 6 : jsDay - 1;
    }

    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - todayIndex);
    weekStart.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((airingAt * 1000 - weekStart.getTime()) / (24 * 60 * 60 * 1000));
    return Math.max(0, Math.floor(diffDays / 7));
};

export { getAiringDay, getAiringMinuteOfDay, getDayKey, getTodayIndex, getWeeksUntilAiring };
export type { DayKey };
