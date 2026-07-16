import clsx from 'clsx';

import type { ErrorStateRootProps } from './error-state.types';

import './error-state.css';

const ErrorStateRoot = (props: ErrorStateRootProps) => {
    const { className, ...rest } = props;

    const rootClsx = clsx('error-state', className);

    return <div {...rest} className={rootClsx} />;
};

export { ErrorStateRoot };
