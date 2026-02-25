import clsx from 'clsx';

import type { WeeklyCalendarRootProps } from './weekly-calendar.types';

import './weekly-calendar.css';

const WeeklyCalendarRoot = (props: WeeklyCalendarRootProps) => {
    const { children, className, ...rest } = props;
    const rootClsx = clsx('weekly-calendar', className);

    return (
        <div className={rootClsx} {...rest}>
            {children}
        </div>
    );
};

export { WeeklyCalendarRoot };
