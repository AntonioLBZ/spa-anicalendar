'use client';

import { Button } from '@/components';

import './calendar-toolbar.css';

import { useCalendarToolbar } from './use-calendar-toolbar';

import type { CalendarToolbarProps } from './calendar-toolbar.types';

const CalendarToolbar = (props: CalendarToolbarProps) => {
    const { state, copy, actions } = useCalendarToolbar(props);

    return (
        <div className="calendar-toolbar">
            <div className="calendar-toolbar__row">
                <div className="calendar-toolbar__stats body-m">
                    {copy.pendingStat && <span className="calendar-toolbar__stat">{copy.pendingStat}</span>}
                    {copy.nextEpisodeStat && <span className="calendar-toolbar__stat">{copy.nextEpisodeStat}</span>}
                </div>
                <div className="calendar-toolbar__controls">
                    {state.isEditMode && actions.onToggleAll && (
                        <Button variant="secondary" size="s" onPress={actions.onToggleAll}>
                            {copy.toggleAll}
                        </Button>
                    )}
                    {state.isEditMode ? (
                        <>
                            <Button variant="secondary" size="s" onPress={actions.onCancel}>
                                {copy.cancel}
                            </Button>
                            <Button variant="primary" size="s" onPress={actions.onSave}>
                                {copy.save}
                            </Button>
                        </>
                    ) : (
                        <Button variant="secondary" size="s" onPress={actions.onEnter}>
                            {copy.edit}
                        </Button>
                    )}
                </div>
            </div>
            <p className="calendar-toolbar__hint body-s">
                {copy.hint} {state.isEditMode && <span className="calendar-toolbar__count">{copy.hiddenCount}</span>}
            </p>
        </div>
    );
};

export { CalendarToolbar };
