import clsx from 'clsx';

import type { WeeklyCalendarDayEmptyProps } from './weekly-calendar.types';

const WeeklyCalendarDayEmpty = (props: WeeklyCalendarDayEmptyProps) => {
    const { children, className, ...rest } = props;
    const emptyClsx = clsx('weekly-calendar__day-empty', 'body-2', className);

    return (
        <div className={emptyClsx} {...rest}>
            {children}
        </div>
    );
};

export { WeeklyCalendarDayEmpty };
