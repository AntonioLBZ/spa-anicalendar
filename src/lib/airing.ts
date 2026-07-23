import type { WeekStartDay, TimeFormat } from '@/contexts/settings-context';
import type { AnimeEntry, MediaSeason } from '@/services';

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
 * Returns the local minute-of-day (0-1439) for a Unix timestamp — used to order same-weekday
 * entries by time of day. Two entries grouped into the same weekday bucket (via `getAiringDay`,
 * which discards the date) can belong to different calendar weeks — e.g. one airs later today
 * and another already aired this week so its *next* episode falls next week — so comparing raw
 * `airingAt` epoch values would sort by week instead of by time of day.
 */
const getAiringMinuteOfDay = (airingAt: number): number => {
    const date = new Date(airingAt * 1000);
    return date.getHours() * 60 + date.getMinutes();
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
 * Returns the id of the entry with the soonest upcoming airing time, or null if none are upcoming.
 * Entries with no upcoming episode, or whose episode has already aired, are ignored.
 */
const getNextAiringEntryId = (entries: AnimeEntry[]): number | null => {
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

    return nextEntryId;
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

/**
 * Formats a countdown breakdown using the caller's translator.
 * Shared between any UI that needs to render "time until airing" (e.g. AnimeCard, calendar toolbar).
 */
type CountdownTranslator = (key: string, values?: Record<string, number>) => string;

const formatCountdown = (t: CountdownTranslator, countdown: CountdownBreakdown): string => {
    switch (countdown.unit) {
        case 'aired':
            return t('aired');
        case 'days':
            return t('countdownDays', { days: countdown.days, hours: countdown.hours });
        case 'hours':
            return t('countdownHours', { hours: countdown.hours, minutes: countdown.minutes });
        case 'minutes':
            return t('countdownMinutes', { minutes: countdown.minutes });
    }
};

/**
 * Derives the AniList season and year for a given date.
 * AniList seasons: WINTER=Dec-Feb, SPRING=Mar-May, SUMMER=Jun-Aug, FALL=Sep-Nov.
 * December belongs to WINTER of the *following* year (AniList convention).
 */
const deriveSeasonFromDate = (date: Date): { season: MediaSeason; seasonYear: number } => {
    const month = date.getMonth();
    const year = date.getFullYear();

    if (month === 11) return { season: 'WINTER', seasonYear: year + 1 };
    if (month <= 1) return { season: 'WINTER', seasonYear: year };
    if (month <= 4) return { season: 'SPRING', seasonYear: year };
    if (month <= 7) return { season: 'SUMMER', seasonYear: year };
    return { season: 'FALL', seasonYear: year };
};

/**
 * Returns the current AniList season and year for a given date (defaults to now).
 */
const getCurrentSeason = (date: Date = new Date()): { season: MediaSeason; seasonYear: number } => deriveSeasonFromDate(date);

/**
 * True iff the entry's own `season`/`seasonYear` (when the media originally started airing)
 * matches the current season.
 */
const startedInCurrentSeason = (entry: AnimeEntry, now: Date = new Date()): boolean => {
    if (!entry.season || !entry.seasonYear) return false;

    const current = getCurrentSeason(now);
    return entry.season === current.season && entry.seasonYear === current.seasonYear;
};

/**
 * True iff the entry's `endDate` is fully resolved (day/month/year all present) and falls in the
 * current season. Runs unconditionally whenever `endDate` is usable — it must NOT be gated by
 * whether `entry.season` is present, or 2-cour shows (which always have `season` set by
 * AniList/MAL) would never be checked for finishing in a later season than they started.
 */
const finishedInCurrentSeason = (entry: AnimeEntry, now: Date = new Date()): boolean => {
    const { day, month, year } = entry.endDate;
    if (day === undefined || month === undefined || year === undefined) return false;

    const endDate = new Date(year, month - 1, day);
    const derived = deriveSeasonFromDate(endDate);
    const current = getCurrentSeason(now);
    return derived.season === current.season && derived.seasonYear === current.seasonYear;
};

/**
 * True iff the entry has finished airing and either started or finished in the current season
 * (covers both single-cour shows and 2-cour shows that started in an earlier season).
 */
const isFinishedInCurrentSeason = (entry: AnimeEntry, now: Date = new Date()): boolean =>
    entry.status === 'FINISHED' && (startedInCurrentSeason(entry, now) || finishedInCurrentSeason(entry, now));

/**
 * Aggregate stats over a set of (already visible/filtered) entries:
 * total pending episodes, total pending watch time, and the soonest upcoming airing time.
 */
type CalendarStats = {
    pendingEpisodes: number;
    pendingMinutes: number;
    nextAiringAt: number | null;
};

const getCalendarStats = (entries: AnimeEntry[]): CalendarStats => {
    let pendingEpisodes = 0;
    let pendingMinutes = 0;
    let nextAiringAt: number | null = null;
    const now = Math.floor(Date.now() / 1000);

    for (const entry of entries) {
        const nextEp = entry.nextAiringEpisode;
        if (!nextEp) continue;

        const pending = entry.progress !== undefined ? nextEp.episode - entry.progress - 1 : 0;
        if (pending > 0) {
            pendingEpisodes += pending;
            if (entry.duration) pendingMinutes += pending * entry.duration;
        }

        if (nextEp.airingAt >= now && (nextAiringAt === null || nextEp.airingAt < nextAiringAt)) {
            nextAiringAt = nextEp.airingAt;
        }
    }

    return { pendingEpisodes, pendingMinutes, nextAiringAt };
};

export {
    getAiringDay,
    getAiringMinuteOfDay,
    getLocalAiringTime,
    getTimeUntilAiring,
    getDayKey,
    getTodayIndex,
    getNextAiringEntryId,
    getCalendarStats,
    formatCountdown,
    getCurrentSeason,
    deriveSeasonFromDate,
    startedInCurrentSeason,
    finishedInCurrentSeason,
    isFinishedInCurrentSeason,
};
export type { DayKey, CountdownBreakdown, CalendarStats, CountdownTranslator };
