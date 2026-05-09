import clsx from 'clsx';

import type { WeeklyCalendarSectionHeaderProps } from './weekly-calendar.types';

const WeeklyCalendarSectionHeader = (props: WeeklyCalendarSectionHeaderProps) => {
    const { children, className, ...rest } = props;
    const headerClsx = clsx('weekly-calendar__section-header', 'label-1', className);

    return (
        <div className={headerClsx} {...rest}>
            {children}
        </div>
    );
};

export { WeeklyCalendarSectionHeader };
