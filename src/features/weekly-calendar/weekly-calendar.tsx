'use client';

import { useTranslations } from 'next-intl';
import React, { useEffect, useMemo, useRef } from 'react';

import { Divider } from '@/components';
import { useSeasonalFilters } from '@/contexts';
import { useSettingsContext } from '@/contexts/settings-context';
import { AnimeCard } from '@/features/anime-card';
import { EntryVisibilityControls } from '@/features/entry-visibility';
import { SeasonalFiltersTrigger } from '@/features/seasonal-filters';
import { getAiringDay, getAiringMinuteOfDay, getNextAiringEntryId, getTodayIndex } from '@/lib/airing';
import { useLayoutMode } from '@/lib/use-layout-mode';

import { filterByContent, filterByHidden } from './filters';
import { WeeklyCalendarDay } from './weekly-calendar-day';
import { getGridConfigForLayout } from './weekly-calendar-layout';
import { WeeklyCalendarSkeleton } from './weekly-calendar-skeleton';

import './weekly-calendar.css';

import type { ResolvedCalendarLayout, WeeklyCalendarProps } from './weekly-calendar.types';
import type { WeekStartDay } from '@/contexts/settings-context';
import type { AnimeEntry } from '@/services';

type DayEntries = {
    [day: number]: AnimeEntry[];
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

    for (const day of Object.values(days)) {
        day.sort(
            (a, b) =>
                getAiringMinuteOfDay(a.nextAiringEpisode!.airingAt) - getAiringMinuteOfDay(b.nextAiringEpisode!.airingAt)
        );
    }

    return { days, noAiring };
};

const WeeklyCalendar = (props: WeeklyCalendarProps) => {
    const {
        entries,
        isLoading = false,
        isEditMode = false,
        hiddenIds = [],
        onToggleEntry,
        showProgress = true,
        showWatchStatus = true,
        emptyMessage,
        noAiringLabel,
        visibility,
        hideNewSeasonFilter,
    } = props;
    const { emptyDaysMode, weekStartDay, calendarLayout } = useSettingsContext();
    const { filters } = useSeasonalFilters();
    const layoutMode = useLayoutMode();
    const t = useTranslations('weeklyCalendar');

    const filtered = useMemo(() => {
        const byContent = filterByContent(entries, filters.contentFilter);
        return isEditMode ? byContent : filterByHidden(byContent, hiddenIds);
    }, [entries, filters.contentFilter, isEditMode, hiddenIds]);
    const nextAiringEntryId = useMemo(() => getNextAiringEntryId(filtered), [filtered]);
    const todayIndex = getTodayIndex(weekStartDay);
    const { days, noAiring } = useMemo(() => groupByAiringDay(filtered, weekStartDay), [filtered, weekStartDay]);
    const hasScrolledToToday = useRef(false);

    const headerActions = visibility && (
        <div className="weekly-calendar__header-actions">
            <EntryVisibilityControls {...visibility} />
            {!visibility.isEditMode && <SeasonalFiltersTrigger hideNewSeasonFilter={hideNewSeasonFilter} />}
        </div>
    );

    const resolvedLayout: ResolvedCalendarLayout =
        calendarLayout === 'auto' ? (layoutMode === 'desktop' ? 'grid' : 'list') : calendarLayout;
    const isVertical = resolvedLayout === 'list';
    const getGridStyle = (columns: number) =>
        isVertical ? undefined : (getGridConfigForLayout(layoutMode, columns).cssVariables as React.CSSProperties);

    const hideEmptyDays = emptyDaysMode === 'hide';
    const visibleDays = Object.entries(days).filter(([, entries]) => !(hideEmptyDays && entries.length === 0));
    const firstVisibleDay = visibleDays.length > 0 ? Number(visibleDays[0][0]) : null;
    const isTodayVisible = visibleDays.some(([dayIndex]) => Number(dayIndex) === todayIndex);

    // In the stacked list, today can sit several rows down: bring it into view once, when the data first
    // arrives, unless it's already the first row or the user has started scrolling.
    useEffect(() => {
        if (hasScrolledToToday.current || isLoading || !isVertical || filtered.length === 0) return;
        hasScrolledToToday.current = true;

        if (!isTodayVisible || firstVisibleDay === todayIndex || window.scrollY > 0) return;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        document
            .getElementById(`day-${todayIndex}`)
            ?.parentElement?.scrollIntoView?.({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }, [isLoading, isVertical, filtered.length, isTodayVisible, firstVisibleDay, todayIndex]);

    if (isLoading) {
        return (
            <div className="weekly-calendar body-l" style={getGridStyle(7)} aria-busy="true">
                <div className="weekly-calendar__section">
                    <div className="weekly-calendar__section-header label-l">
                        {t('sectionHeader')}
                        {headerActions}
                    </div>
                    <span className="weekly-calendar__status" role="status">
                        {t('loading')}
                    </span>
                    <WeeklyCalendarSkeleton layout={resolvedLayout} weekStartDay={weekStartDay} todayIndex={todayIndex} />
                </div>
            </div>
        );
    }

    if (filtered.length === 0) {
        return (
            <div className="weekly-calendar body-l">
                <div className="weekly-calendar__section-header label-l">
                    {t('sectionHeader')}
                    {headerActions}
                </div>
                <div className="weekly-calendar__empty">{emptyMessage ?? t('emptyList')}</div>
            </div>
        );
    }

    const style = getGridStyle(visibleDays.length);
    const containerClsx = isVertical ? 'weekly-calendar__list' : 'weekly-calendar__grid';

    return (
        <div className="weekly-calendar body-l" style={style}>
            <div className="weekly-calendar__section">
                <div className="weekly-calendar__section-header label-l">
                    {t('sectionHeader')}
                    {headerActions}
                </div>
                <div className={containerClsx} role="list" aria-label={t('sectionHeader')}>
                    {visibleDays.map(([dayIndex, entries], position) => (
                        <WeeklyCalendarDay
                            key={dayIndex}
                            enterOffset={position}
                            dayIndex={Number(dayIndex)}
                            entries={entries}
                            isToday={Number(dayIndex) === todayIndex}
                            weekStartDay={weekStartDay}
                            layout={resolvedLayout}
                            isEditMode={isEditMode}
                            hiddenIds={hiddenIds}
                            onToggleEntry={onToggleEntry}
                            nextAiringEntryId={nextAiringEntryId}
                            showProgress={showProgress}
                            showWatchStatus={showWatchStatus}
                        />
                    ))}
                </div>
            </div>
            {noAiring.length > 0 && (
                <>
                    <Divider size="l" />
                    <div className="weekly-calendar__section">
                        <div className="weekly-calendar__section-header label-l">
                            {noAiringLabel ?? t('noUpcoming')}
                        </div>
                        <div className="weekly-calendar__section-entries">
                            {noAiring.map((entry, index) => (
                                <AnimeCard
                                    key={entry.id}
                                    entry={entry}
                                    enterIndex={index}
                                    isEditMode={isEditMode}
                                    isHidden={hiddenIds.includes(entry.id)}
                                    onToggle={() => onToggleEntry?.(entry.id)}
                                    isNextAiring={entry.id === nextAiringEntryId}
                                    showProgress={showProgress}
                                    showWatchStatus={showWatchStatus}
                                />
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export { WeeklyCalendar };
