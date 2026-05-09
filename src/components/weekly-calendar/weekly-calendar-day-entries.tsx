import clsx from 'clsx';

import type { WeeklyCalendarDayEntriesProps } from './weekly-calendar.types';

const WeeklyCalendarDayEntries = (props: WeeklyCalendarDayEntriesProps) => {
    const { children, className, ...rest } = props;
    const entriesClsx = clsx('weekly-calendar__day-entries', className);

    return (
        <div className={entriesClsx} {...rest}>
            {children}
        </div>
    );
};

export { WeeklyCalendarDayEntries };
