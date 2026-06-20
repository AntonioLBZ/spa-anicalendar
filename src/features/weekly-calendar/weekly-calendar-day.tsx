import clsx from 'clsx';

import { AnimeCard } from '@/features/anime-card';
import { getDayName } from '@/lib/airing';

import { WeeklyCalendarDayProps } from './weekly-calendar.types';

import './weekly-calendar-day.css';

const WeeklyCalendarDay = ({ dayIndex, entries, isToday, collapseContent, weekStartDay }: WeeklyCalendarDayProps) => {
    const dayId = `day-${dayIndex}`;
    const isEmpty = entries.length === 0;
    const dayClsx = clsx('day', { 'day--today': isToday });

    return (
        <div className={dayClsx} role="listitem" aria-labelledby={dayId}>
            <div className="day__header label-m" id={dayId}>
                <div className="day__name">
                    {getDayName(dayIndex, weekStartDay)}
                    {isToday && <span className="day__today-badge">Today</span>}
                </div>
                <div className="day__count body-s">{`Entries: ${entries.length}`}</div>
            </div>
            {!(isEmpty && collapseContent) && (
                <div className="day__entries">
                    {entries.length > 0 ? (
                        entries.map((entry) => <AnimeCard key={entry.id} entry={entry} hideStatus />)
                    ) : (
                        <div className="day__empty body-m">No episodes</div>
                    )}
                </div>
            )}
        </div>
    );
};

export { WeeklyCalendarDay };
