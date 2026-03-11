'use client';

import { useMemo } from 'react';

import { AnimeCard } from '@/modules/anime-card';
import { useSettingsContext } from '@/modules/settings-context';
import { WeeklyCalendar as Calendar } from '@/platform/components';
import { getAiringDay, getDayName, getTodayIndex } from '@/platform/lib/airing';

import type { WeeklyCalendarProps } from './weekly-calendar.types';
import type { ContentFilter, WeekStartDay } from '@/modules/settings-context';
import type { MediaListEntry } from '@/platform/services/api';

type DayEntries = {
    [day: number]: MediaListEntry[];
};

const filterByContent = (entries: MediaListEntry[], contentFilter: ContentFilter): MediaListEntry[] => {
    if (contentFilter === 'plus18') return entries;

    return entries.filter((entry) => {
        if (contentFilter === 'sfw') {
            return !entry.media.isAdult && !entry.media.genres.includes('Ecchi');
        }
        return !entry.media.isAdult;
    });
};

const groupByAiringDay = (
    entries: MediaListEntry[],
    weekStartDay: WeekStartDay
): {
    days: DayEntries;
    noAiring: MediaListEntry[];
} => {
    const days: DayEntries = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
    const noAiring: MediaListEntry[] = [];

    for (const entry of entries) {
        if (entry.media.nextAiringEpisode) {
            const day = getAiringDay(entry.media.nextAiringEpisode.airingAt, weekStartDay);
            days[day].push(entry);
        } else {
            noAiring.push(entry);
        }
    }

    return { days, noAiring };
};

const WeeklyCalendar = (props: WeeklyCalendarProps) => {
    const { entries } = props;
    const { contentFilter, emptyDaysMode, weekStartDay } = useSettingsContext();

    const filtered = useMemo(() => filterByContent(entries, contentFilter), [entries, contentFilter]);
    const todayIndex = getTodayIndex(weekStartDay);
    const { days, noAiring } = useMemo(
        () => groupByAiringDay(filtered, weekStartDay),
        [filtered, weekStartDay]
    );

    if (filtered.length === 0) {
        return <div className="weekly-calendar__empty body-1">No anime in your watching list.</div>;
    }

    return (
        <Calendar.Root>
            <Calendar.Grid aria-label="Weekly anime schedule">
                {Array.from({ length: 7 }, (_, i) => {
                    const dayId = `day-${i}`;
                    const isEmpty = days[i].length === 0;

                    if (isEmpty && emptyDaysMode === 'hide') return null;

                    return (
                        <Calendar.Day key={i} isToday={i === todayIndex} aria-labelledby={dayId}>
                            <Calendar.DayHeader isToday={i === todayIndex} id={dayId}>
                                {getDayName(i, weekStartDay)}
                            </Calendar.DayHeader>
                            {!(isEmpty && emptyDaysMode === 'minimize') && (
                                <Calendar.DayEntries>
                                    {days[i].length > 0 ? (
                                        days[i].map((entry) => (
                                            <AnimeCard key={entry.id} entry={entry} />
                                        ))
                                    ) : (
                                        <div className="weekly-calendar__day-empty body-2">
                                            No episodes
                                        </div>
                                    )}
                                </Calendar.DayEntries>
                            )}
                        </Calendar.Day>
                    );
                })}
            </Calendar.Grid>
            {noAiring.length > 0 && (
                <Calendar.Section>
                    <Calendar.SectionHeader>No upcoming episodes</Calendar.SectionHeader>
                    <Calendar.SectionEntries>
                        {noAiring.map((entry) => (
                            <AnimeCard key={entry.id} entry={entry} />
                        ))}
                    </Calendar.SectionEntries>
                </Calendar.Section>
            )}
        </Calendar.Root>
    );
};

export { WeeklyCalendar };
