'use client';

import './calendar-toolbar.css';

import { useCalendarToolbar } from './use-calendar-toolbar';

import type { CalendarToolbarProps } from './calendar-toolbar.types';

const CalendarToolbar = (props: CalendarToolbarProps) => {
    const { state, copy } = useCalendarToolbar(props);

    return (
        <div className="calendar-toolbar">
            <div className="calendar-toolbar__stats body-m">
                {copy.pendingStat && <span className="calendar-toolbar__stat">{copy.pendingStat}</span>}
                {copy.nextEpisodeStat && <span className="calendar-toolbar__stat">{copy.nextEpisodeStat}</span>}
            </div>
            <p className="calendar-toolbar__hint body-s">
                {copy.hint} {state.isEditMode && <span className="calendar-toolbar__count">{copy.hiddenCount}</span>}
            </p>
        </div>
    );
};

export { CalendarToolbar };
