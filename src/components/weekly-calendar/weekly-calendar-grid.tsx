import clsx from 'clsx';
import React from 'react';

import type { WeeklyCalendarGridProps } from './weekly-calendar.types';

const WeeklyCalendarGrid = (props: WeeklyCalendarGridProps) => {
    const { children, className, collapseContent, style, ...rest } = props;
    const gridClsx = clsx(
        'weekly-calendar__grid',
        { 'weekly-calendar__grid--collapse-content': collapseContent },
        className
    );

    const gridStyle = {
        ...style,
        '--columns': React.Children.count(children),
    };

    return (
        <div className={gridClsx} style={gridStyle} {...rest} role="list">
            {children}
        </div>
    );
};

export { WeeklyCalendarGrid };
