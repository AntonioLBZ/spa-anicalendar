import React from 'react';
import type { TStopPropagationProps } from './stop-propagation.types';
import { clsx } from 'clsx';

const StopPropagation = (props: TStopPropagationProps) => {
    const { children, className, tabIndex = -1, ...rest } = props;

    const stopEventPropagation = (e: React.SyntheticEvent): void => {
        e.stopPropagation();
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
        if (e.code === 'Enter' || e.code === 'Space') {
            e.stopPropagation();
        }
    };

    const stopPropagationClsx = clsx('alc-stop-propagation', className);

    return (
        <div
            {...rest}
            onClick={stopEventPropagation}
            onMouseDown={stopEventPropagation}
            onKeyDown={onKeyDown}
            className={stopPropagationClsx}
            tabIndex={tabIndex}
        >
            {children}
        </div>
    );
};

export { StopPropagation };
