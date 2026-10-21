import type { AnimeEntry } from '@/services';

/** Id of the entry with the soonest upcoming airing time, or null. */
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

/** Pending episodes, pending watch time, and soonest upcoming airing time. */
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

        const isPlanning = entry.listStatus === 'PLANNING';
        const pending = entry.progress !== undefined && !isPlanning ? nextEp.episode - entry.progress - 1 : 0;
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

export { getNextAiringEntryId, getCalendarStats };
export type { CalendarStats };
