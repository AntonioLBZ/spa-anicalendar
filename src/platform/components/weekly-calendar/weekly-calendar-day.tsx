import clsx from 'clsx';

import type { WeeklyCalendarDayProps } from './weekly-calendar.types';

const WeeklyCalendarDay = (props: WeeklyCalendarDayProps) => {
    const { children, className, isToday, ...rest } = props;
    const dayClsx = clsx('weekly-calendar__day', isToday && 'weekly-calendar__day--today', className);

    return (
        <div className={dayClsx} {...rest} role="listitem">
            {children}
        </div>
    );
};

export { WeeklyCalendarDay };
