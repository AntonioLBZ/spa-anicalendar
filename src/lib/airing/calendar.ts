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

/** Full weeks ahead `airingAt` falls, based on real elapsed days from today (0 unless more than 7 days away). */
const getWeeksUntilAiring = (airingAt: number, now: Date = new Date()): number => {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const airingDate = new Date(airingAt * 1000);
    const airingDay = new Date(airingDate.getFullYear(), airingDate.getMonth(), airingDate.getDate());

    const diffDays = Math.round((airingDay.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
    return diffDays > 7 ? Math.floor(diffDays / 7) : 0;
};

export { getAiringDay, getAiringMinuteOfDay, getDayKey, getTodayIndex, getWeeksUntilAiring };
export type { DayKey };
