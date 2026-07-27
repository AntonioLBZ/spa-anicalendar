import type { AnimeEntry, MediaSeason } from '@/services';

/** AniList season/year for a date. December counts as WINTER of the next year. */
const deriveSeasonFromDate = (date: Date): { season: MediaSeason; seasonYear: number } => {
    const month = date.getMonth();
    const year = date.getFullYear();

    if (month === 11) return { season: 'WINTER', seasonYear: year + 1 };
    if (month <= 1) return { season: 'WINTER', seasonYear: year };
    if (month <= 4) return { season: 'SPRING', seasonYear: year };
    if (month <= 7) return { season: 'SUMMER', seasonYear: year };
    return { season: 'FALL', seasonYear: year };
};

/** Current AniList season/year (defaults to now). */
const getCurrentSeason = (date: Date = new Date()): { season: MediaSeason; seasonYear: number } =>
    deriveSeasonFromDate(date);

const SEASON_ORDER: MediaSeason[] = ['WINTER', 'SPRING', 'SUMMER', 'FALL'];

/** AniList season/year following the current one (defaults to now). */
const getNextSeason = (date: Date = new Date()): { season: MediaSeason; seasonYear: number } => {
    const current = getCurrentSeason(date);
    const nextIndex = (SEASON_ORDER.indexOf(current.season) + 1) % SEASON_ORDER.length;

    return {
        season: SEASON_ORDER[nextIndex],
        seasonYear: nextIndex === 0 ? current.seasonYear + 1 : current.seasonYear,
    };
};

/** True iff the entry's own season/seasonYear matches the current season. */
const startedInCurrentSeason = (entry: AnimeEntry, now: Date = new Date()): boolean => {
    if (!entry.season || !entry.seasonYear) return false;

    const current = getCurrentSeason(now);
    return entry.season === current.season && entry.seasonYear === current.seasonYear;
};

/** True iff the entry's endDate is fully resolved and falls in the current season. */
const finishedInCurrentSeason = (entry: AnimeEntry, now: Date = new Date()): boolean => {
    const { day, month, year } = entry.endDate;
    if (day === undefined || month === undefined || year === undefined) return false;

    const endDate = new Date(year, month - 1, day);
    const derived = deriveSeasonFromDate(endDate);
    const current = getCurrentSeason(now);
    return derived.season === current.season && derived.seasonYear === current.seasonYear;
};

/** True iff the entry finished airing and started or finished in the current season. */
const isFinishedInCurrentSeason = (entry: AnimeEntry, now: Date = new Date()): boolean =>
    entry.status === 'FINISHED' && (startedInCurrentSeason(entry, now) || finishedInCurrentSeason(entry, now));

export {
    deriveSeasonFromDate,
    getCurrentSeason,
    getNextSeason,
    startedInCurrentSeason,
    finishedInCurrentSeason,
    isFinishedInCurrentSeason,
};
