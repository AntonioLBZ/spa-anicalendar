import clsx from 'clsx';

import type { WeeklyCalendarGridProps } from './weekly-calendar.types';

const WeeklyCalendarGrid = (props: WeeklyCalendarGridProps) => {
    const { children, className, ...rest } = props;
    const gridClsx = clsx('weekly-calendar__grid', className);

    return (
        <div className={gridClsx} {...rest} role="list">
            {children}
        </div>
    );
};

export { WeeklyCalendarGrid };
