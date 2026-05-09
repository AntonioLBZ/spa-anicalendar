'use client';

import { useMemo } from 'react';

import { WeeklyCalendar as Calendar } from '@/components';
import { useSettingsContext } from '@/contexts/settings-context';
import { AnimeCard } from '@/features/anime-card';
import { getAiringDay, getDayName, getTodayIndex } from '@/lib/airing';

import type { WeeklyCalendarProps } from './weekly-calendar.types';
import type { ContentFilter, WeekStartDay } from '@/contexts/settings-context';
import type { MediaListEntry } from '@/services/api';

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
    const { days, noAiring } = useMemo(() => groupByAiringDay(filtered, weekStartDay), [filtered, weekStartDay]);

    if (filtered.length === 0) {
        return <Calendar.Root>No anime in your watching list.</Calendar.Root>;
    }

    const hideEmptyDays = emptyDaysMode === 'hide';
    const collapseContent = emptyDaysMode === 'minimize';

    return (
        <Calendar.Root>
            <Calendar.Grid aria-label="Weekly anime schedule" collapseContent={collapseContent}>
                {Object.entries(days)
                    .filter(([, entries]) => !(hideEmptyDays && entries.length === 0))
                    .map(([dayIndex, entries]) => {
                        const dayId = `day-${dayIndex}`;
                        const isEmpty = entries.length === 0;
                        const isToday = Number(dayIndex) === todayIndex;

                        return (
                            <Calendar.Day key={dayIndex} isToday={isToday} aria-labelledby={dayId}>
                                <Calendar.DayHeader isToday={isToday} id={dayId}>
                                    {getDayName(Number(dayIndex), weekStartDay)}
                                </Calendar.DayHeader>
                                {!(isEmpty && collapseContent) && (
                                    <Calendar.DayEntries>
                                        {entries.length > 0 ? (
                                            entries.map((entry) => <AnimeCard key={entry.id} entry={entry} />)
                                        ) : (
                                            <Calendar.DayEmpty>No episodes</Calendar.DayEmpty>
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
