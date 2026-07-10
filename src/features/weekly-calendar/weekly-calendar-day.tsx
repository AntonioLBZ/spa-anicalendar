import clsx from 'clsx';

import { Pill } from '@/components';
import { AnimeCard } from '@/features/anime-card';
import { getDayName } from '@/lib/airing';

import { WeeklyCalendarDayProps } from './weekly-calendar.types';

import './weekly-calendar-day.css';

const texts = {
    todayBadge: 'Today',
    noEpisodes: 'No episodes',
};

const WeeklyCalendarDay = ({ dayIndex, entries, isToday, weekStartDay }: WeeklyCalendarDayProps) => {
    const dayId = `day-${dayIndex}`;
    const isEmpty = entries.length === 0;
    const dayClsx = clsx('day', { 'day--today': isToday });

    return (
        <div className={dayClsx} role="listitem" aria-labelledby={dayId}>
            <div className="day__header label-m" id={dayId}>
                <div className="day__name">
                    {getDayName(dayIndex, weekStartDay)}
                    {isToday && <Pill className="day__today-badge">{texts.todayBadge}</Pill>}
                </div>
                <div className="day__count body-s">{`Entries: ${entries.length}`}</div>
            </div>
            <div className="day__entries">
                {!isEmpty ? (
                    entries.map((entry) => <AnimeCard key={entry.id} entry={entry} hideStatus />)
                ) : (
                    <div className="day__empty body-m">{texts.noEpisodes}</div>
                )}
            </div>
        </div>
    );
};

export { WeeklyCalendarDay };
