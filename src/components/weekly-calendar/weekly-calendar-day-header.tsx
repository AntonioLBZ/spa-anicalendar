import clsx from 'clsx';

import type { WeeklyCalendarDayHeaderProps } from './weekly-calendar.types';

const WeeklyCalendarDayHeader = (props: WeeklyCalendarDayHeaderProps) => {
    const { children, className, isToday, ...rest } = props;
    const headerClsx = clsx('weekly-calendar__day-header', 'label-2', className);

    return (
        <div className={headerClsx} {...rest}>
            {children}
            {isToday && <span className="weekly-calendar__today-badge label-2">Today</span>}
        </div>
    );
};

export { WeeklyCalendarDayHeader };
