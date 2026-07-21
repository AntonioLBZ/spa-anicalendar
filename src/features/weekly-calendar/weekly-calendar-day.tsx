import clsx from 'clsx';
import { useTranslations } from 'next-intl';

import { Pill } from '@/components';
import { AnimeCard } from '@/features/anime-card';
import { getDayKey } from '@/lib/airing';

import { WeeklyCalendarDayProps } from './weekly-calendar.types';

import './weekly-calendar-day.css';

const WeeklyCalendarDay = ({
    dayIndex,
    entries,
    isToday,
    weekStartDay,
    layout,
    isEditMode = false,
    hiddenIds = [],
    onToggleEntry,
    nextAiringEntryId = null,
    showProgress = true,
    showWatchStatus = true,
}: WeeklyCalendarDayProps) => {
    const t = useTranslations('weeklyCalendar');
    const dayId = `day-${dayIndex}`;
    const isEmpty = entries.length === 0;
    const dayClsx = clsx('day', { 'day--today': isToday, 'day--row': layout === 'list' });
    const dayKey = getDayKey(dayIndex, weekStartDay);

    return (
        <div className={dayClsx} role="listitem" aria-labelledby={dayId}>
            <div className="day__header label-m" id={dayId}>
                <div className="day__name" title={t(`days.long.${dayKey}`)}>
                    <span>{t(`days.long.${dayKey}`)}</span>
                    {isToday && <Pill className="day__today-badge">{t('today')}</Pill>}
                </div>
                <div className="day__count body-s">{t('entriesCount', { count: entries.length })}</div>
            </div>
            <div className="day__entries">
                {!isEmpty ? (
                    entries.map((entry) => (
                        <AnimeCard
                            key={entry.id}
                            entry={entry}
                            hideStatus
                            isEditMode={isEditMode}
                            isHidden={hiddenIds.includes(entry.id)}
                            onToggle={() => onToggleEntry?.(entry.id)}
                            isNextAiring={entry.id === nextAiringEntryId}
                            showProgress={showProgress}
                            showWatchStatus={showWatchStatus}
                        />
                    ))
                ) : (
                    <div className="day__empty body-m">{t('noEpisodes')}</div>
                )}
            </div>
        </div>
    );
};

export { WeeklyCalendarDay };
