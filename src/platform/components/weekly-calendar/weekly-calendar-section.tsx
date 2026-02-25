import clsx from 'clsx';

import type { WeeklyCalendarSectionProps } from './weekly-calendar.types';

const WeeklyCalendarSection = (props: WeeklyCalendarSectionProps) => {
    const { children, className, ...rest } = props;
    const sectionClsx = clsx('weekly-calendar__section', className);

    return (
        <div className={sectionClsx} {...rest}>
            {children}
        </div>
    );
};

export { WeeklyCalendarSection };
