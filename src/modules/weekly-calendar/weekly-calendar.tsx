'use client';

import clsx from 'clsx';
import { useMemo } from 'react';

import { AnimeCard } from '@/modules/anime-card';
import { getAiringDay, getDayName, getTodayIndex } from '@/platform/lib/airing';

import type { WeeklyCalendarProps } from './weekly-calendar.types';
import type { MediaListEntry } from '@/platform/services/api';


import './weekly-calendar.css';

type DayEntries = {
    [day: number]: MediaListEntry[];
};

const groupByAiringDay = (
    entries: MediaListEntry[]
): {
    days: DayEntries;
    noAiring: MediaListEntry[];
} => {
    const days: DayEntries = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
    const noAiring: MediaListEntry[] = [];

    for (const entry of entries) {
        if (entry.media.nextAiringEpisode) {
            const day = getAiringDay(entry.media.nextAiringEpisode.airingAt);
            days[day].push(entry);
        } else {
            noAiring.push(entry);
        }
    }

    return { days, noAiring };
};

const WeeklyCalendar = (props: WeeklyCalendarProps) => {
    const { entries } = props;
    const todayIndex = getTodayIndex();
    const { days, noAiring } = useMemo(() => groupByAiringDay(entries), [entries]);

    const emptyClsx = 'weekly-calendar__empty';
    const calendarClsx = 'weekly-calendar';
    const gridClsx = 'weekly-calendar__grid';
    const dayHeaderClsx = 'weekly-calendar__day-header';
    const todayBadgeClsx = 'weekly-calendar__today-badge';
    const dayEntriesClsx = 'weekly-calendar__day-entries';
    const dayEmptyClsx = 'weekly-calendar__day-empty';
    const noAiringClsx = 'weekly-calendar__no-airing';
    const noAiringHeaderClsx = 'weekly-calendar__no-airing-header';
    const noAiringEntriesClsx = 'weekly-calendar__no-airing-entries';

    if (entries.length === 0) {
        return <div className={emptyClsx}>No anime in your watching list.</div>;
    }

    return (
        <div className={calendarClsx}>
            <div className={gridClsx} role="list" aria-label="Weekly anime schedule">
                {Array.from({ length: 7 }, (_, i) => {
                    const dayClsx = clsx('weekly-calendar__day', {
                        'weekly-calendar__day--today': i === todayIndex,
                    });
                    return (
                        <div key={i} className={dayClsx} role="listitem">
                            <div className={dayHeaderClsx}>
                                {getDayName(i)}
                                {i === todayIndex && <span className={todayBadgeClsx}>Today</span>}
                            </div>
                            <div className={dayEntriesClsx}>
                                {days[i].length > 0 ? (
                                    days[i].map((entry) => <AnimeCard key={entry.id} entry={entry} />)
                                ) : (
                                    <div className={dayEmptyClsx}>No episodes</div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            {noAiring.length > 0 && (
                <div className={noAiringClsx}>
                    <div className={noAiringHeaderClsx}>No upcoming episodes</div>
                    <div className={noAiringEntriesClsx}>
                        {noAiring.map((entry) => (
                            <AnimeCard key={entry.id} entry={entry} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export { WeeklyCalendar };
