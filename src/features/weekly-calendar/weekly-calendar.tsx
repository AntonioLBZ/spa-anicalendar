'use client';

import { useTranslations } from 'next-intl';
import React, { useMemo } from 'react';

import { Divider } from '@/components';
import { useSettingsContext } from '@/contexts/settings-context';
import { AnimeCard } from '@/features/anime-card';
import { getAiringDay, getTodayIndex } from '@/lib/airing';
import { useLayoutMode } from '@/lib/use-layout-mode';

import { WeeklyCalendarDay } from './weekly-calendar-day';
import { getGridConfigForLayout } from './weekly-calendar-layout';

import './weekly-calendar.css';

import type { WeeklyCalendarProps } from './weekly-calendar.types';
import type { ContentFilter, WeekStartDay } from '@/contexts/settings-context';
import type { AnimeEntry } from '@/services';

type DayEntries = {
    [day: number]: AnimeEntry[];
};

const filterByContent = (entries: AnimeEntry[], contentFilter: ContentFilter): AnimeEntry[] => {
    if (contentFilter === 'plus18') return entries;

    return entries.filter((entry) => {
        if (contentFilter === 'sfw') {
            return !entry.isAdult && !entry.genres.includes('Ecchi');
        }
        return !entry.isAdult;
    });
};

const groupByAiringDay = (
    entries: AnimeEntry[],
    weekStartDay: WeekStartDay
): {
    days: DayEntries;
    noAiring: AnimeEntry[];
} => {
    const days: DayEntries = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
    const noAiring: AnimeEntry[] = [];

    for (const entry of entries) {
        if (entry.nextAiringEpisode) {
            const day = getAiringDay(entry.nextAiringEpisode.airingAt, weekStartDay);
            days[day].push(entry);
        } else {
            noAiring.push(entry);
        }
    }

    return { days, noAiring };
};

const WeeklyCalendar = (props: WeeklyCalendarProps) => {
    const { entries } = props;
    const { contentFilter, emptyDaysMode, weekStartDay, calendarLayout } = useSettingsContext();
    const layoutMode = useLayoutMode();
    const t = useTranslations('weeklyCalendar');

    const filtered = useMemo(() => filterByContent(entries, contentFilter), [entries, contentFilter]);
    const todayIndex = getTodayIndex(weekStartDay);
    const { days, noAiring } = useMemo(() => groupByAiringDay(filtered, weekStartDay), [filtered, weekStartDay]);

    if (filtered.length === 0) {
        return <div className="weekly-calendar body-l">{t('emptyList')}</div>;
    }

    const hideEmptyDays = emptyDaysMode === 'hide';

    const visibleDays = Object.entries(days).filter(([, entries]) => !(hideEmptyDays && entries.length === 0));

    const isVertical = calendarLayout === 'vertical';

    const style = isVertical
        ? undefined
        : (getGridConfigForLayout(layoutMode, visibleDays.length).cssVariables as React.CSSProperties);
    const containerClsx = isVertical ? 'weekly-calendar__list' : 'weekly-calendar__grid';

    return (
        <div className="weekly-calendar body-l" style={style}>
            <div className="weekly-calendar__section">
                <div className="weekly-calendar__section-header label-l">{t('sectionHeader')}</div>
                <div className={containerClsx} role="list" aria-label={t('sectionHeader')}>
                    {visibleDays.map(([dayIndex, entries]) => (
                        <WeeklyCalendarDay
                            key={dayIndex}
                            dayIndex={Number(dayIndex)}
                            entries={entries}
                            isToday={Number(dayIndex) === todayIndex}
                            weekStartDay={weekStartDay}
                            layout={calendarLayout}
                        />
                    ))}
                </div>
            </div>
            {noAiring.length > 0 && (
                <>
                    <Divider />
                    <div className="weekly-calendar__section">
                        <div className="weekly-calendar__section-header label-l">{t('noUpcoming')}</div>
                        <div className="weekly-calendar__section-entries">
                            {noAiring.map((entry) => (
                                <AnimeCard key={entry.id} entry={entry} />
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export { WeeklyCalendar };
