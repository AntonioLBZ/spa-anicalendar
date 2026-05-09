import clsx from 'clsx';

import type { WeeklyCalendarSectionEntriesProps } from './weekly-calendar.types';

const WeeklyCalendarSectionEntries = (props: WeeklyCalendarSectionEntriesProps) => {
    const { children, className, ...rest } = props;
    const entriesClsx = clsx('weekly-calendar__section-entries', className);

    return (
        <div className={entriesClsx} {...rest}>
            {children}
        </div>
    );
};

export { WeeklyCalendarSectionEntries };
