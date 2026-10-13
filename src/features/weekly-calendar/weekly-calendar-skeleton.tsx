import clsx from 'clsx';
import { useTranslations } from 'next-intl';

import { getDayKey } from '@/lib/airing';

import type { WeeklyCalendarSkeletonProps } from './weekly-calendar.types';

import './weekly-calendar-day.css';

// Uneven per-day counts so the placeholder reads as a schedule rather than a uniform block.
const SKELETON_CARDS_PER_DAY = [3, 2, 3, 2, 4, 3, 2];

const WeeklyCalendarSkeleton = (props: WeeklyCalendarSkeletonProps) => {
    const { layout, weekStartDay, todayIndex } = props;
    const t = useTranslations('weeklyCalendar');

    const containerClsx = layout === 'list' ? 'weekly-calendar__list' : 'weekly-calendar__grid';

    return (
        <div className={containerClsx} aria-hidden="true">
            {SKELETON_CARDS_PER_DAY.map((cardCount, dayIndex) => {
                const dayClsx = clsx('day', { 'day--today': dayIndex === todayIndex, 'day--row': layout === 'list' });

                return (
                    <div key={dayIndex} className={dayClsx}>
                        <div className="day__header label-m">
                            <div className="day__name">{t(`days.long.${getDayKey(dayIndex, weekStartDay)}`)}</div>
                        </div>
                        <div className="day__entries">
                            <div className="day__track">
                                {Array.from({ length: cardCount }, (_, cardIndex) => (
                                    <div key={cardIndex} className="day__skeleton-card" />
                                ))}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export { WeeklyCalendarSkeleton };
