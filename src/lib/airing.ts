import type { WeekStartDay, TimeFormat } from '@/contexts/settings-context';

/**
 * Returns the day of the week for a Unix timestamp.
 * Monday-first: 0 = Monday, 6 = Sunday
 * Sunday-first: 0 = Sunday, 6 = Saturday
 */
const getAiringDay = (airingAt: number, weekStartDay: WeekStartDay = 'monday'): number => {
    const jsDay = new Date(airingAt * 1000).getDay();

    if (weekStartDay === 'sunday') {
        return jsDay;
    }

    return jsDay === 0 ? 6 : jsDay - 1;
};

/**
 * Returns a formatted local time string for a Unix timestamp.
 */
const getLocalAiringTime = (airingAt: number, timeFormat: TimeFormat = '24h'): string => {
    return new Date(airingAt * 1000).toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: timeFormat === '12h',
    });
};

/**
 * Returns a human-readable countdown string.
 * Examples: "2d 5h", "5h 30m", "30m"
 */
const getTimeUntilAiring = (airingAt: number): string => {
    const now = Math.floor(Date.now() / 1000);
    const diff = airingAt - now;

    if (diff <= 0) return 'Aired';

    const days = Math.floor(diff / 86400);
    const hours = Math.floor((diff % 86400) / 3600);
    const minutes = Math.floor((diff % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
};

/**
 * Returns the day name for display in the calendar header.
 * Monday-first: dayIndex 0 = Monday, 6 = Sunday
 * Sunday-first: dayIndex 0 = Sunday, 6 = Saturday
 */
const getDayName = (dayIndex: number, weekStartDay: WeekStartDay = 'monday'): string => {
    const mondayFirst = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const sundayFirst = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const days = weekStartDay === 'sunday' ? sundayFirst : mondayFirst;
    return days[dayIndex];
};

/**
 * Returns today's day index based on the week start day.
 * Monday-first: 0 = Monday, 6 = Sunday
 * Sunday-first: 0 = Sunday, 6 = Saturday
 */
const getTodayIndex = (weekStartDay: WeekStartDay = 'monday'): number => {
    const jsDay = new Date().getDay();

    if (weekStartDay === 'sunday') {
        return jsDay;
    }

    return jsDay === 0 ? 6 : jsDay - 1;
};

export {
    getAiringDay,
    getLocalAiringTime,
    getTimeUntilAiring,
    getDayName,
    getTodayIndex,
};
