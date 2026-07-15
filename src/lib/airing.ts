import type { WeekStartDay, TimeFormat } from '@/contexts/settings-context';
import type { AnimeEntry } from '@/services';

type DayKey = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

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
 * Returns a countdown breakdown to be formatted by the caller (i18n consumer).
 * `unit` selects which translation key the caller should use.
 */
type CountdownBreakdown =
    | { unit: 'aired' }
    | { unit: 'days'; days: number; hours: number }
    | { unit: 'hours'; hours: number; minutes: number }
    | { unit: 'minutes'; minutes: number };

const getTimeUntilAiring = (airingAt: number): CountdownBreakdown => {
    const now = Math.floor(Date.now() / 1000);
    const diff = airingAt - now;

    if (diff <= 0) return { unit: 'aired' };

    const days = Math.floor(diff / 86400);
    const hours = Math.floor((diff % 86400) / 3600);
    const minutes = Math.floor((diff % 3600) / 60);

    if (days > 0) return { unit: 'days', days, hours };
    if (hours > 0) return { unit: 'hours', hours, minutes };
    return { unit: 'minutes', minutes };
};

/**
 * Returns the day key (for i18n lookup) for display in the calendar header.
 * Monday-first: dayIndex 0 = Monday, 6 = Sunday
 * Sunday-first: dayIndex 0 = Sunday, 6 = Saturday
 */
const getDayKey = (dayIndex: number, weekStartDay: WeekStartDay = 'monday'): DayKey => {
    const mondayFirst: DayKey[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const sundayFirst: DayKey[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    const days = weekStartDay === 'sunday' ? sundayFirst : mondayFirst;
    return days[dayIndex];
};

/**
 * Marks the single entry with the soonest upcoming airing time as `isNextAiring`.
 * Entries with no upcoming episode, or whose episode has already aired, are ignored.
 */
const getEntriesWithNextAiring = (entries: AnimeEntry[]): AnimeEntry[] => {
    const now = Math.floor(Date.now() / 1000);

    let nextEntryId: number | null = null;
    let soonestAiringAt = Infinity;

    for (const entry of entries) {
        const airingAt = entry.nextAiringEpisode?.airingAt;

        if (airingAt !== undefined && airingAt >= now && airingAt < soonestAiringAt) {
            soonestAiringAt = airingAt;
            nextEntryId = entry.id;
        }
    }

    if (nextEntryId === null) return entries;

    return entries.map((entry) => (entry.id === nextEntryId ? { ...entry, isNextAiring: true } : entry));
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
    getDayKey,
    getTodayIndex,
    getEntriesWithNextAiring,
};
export type { DayKey, CountdownBreakdown };
