import type { SyntheticEvent, KeyboardEvent } from 'react';
import type { StopPropagationProps } from './stop-propagation.types';
import clsx from 'clsx';

const StopPropagation = (props: StopPropagationProps) => {
    const { children, className, tabIndex = -1, ...rest } = props;

    const stopEventPropagation = (e: SyntheticEvent): void => {
        e.stopPropagation();
    };

    const onKeyDown = (e: KeyboardEvent<HTMLDivElement>): void => {
        if (e.code === 'Enter' || e.code === 'Space') {
            e.stopPropagation();
        }
    };

    const stopPropagationClsx = clsx('stop-propagation', className);

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
