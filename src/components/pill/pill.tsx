import { clsx } from 'clsx';

import type { PillProps } from './pill.types';

import './pill.css';

const Pill = (props: PillProps) => {
    const { className, ...rest } = props;

    const pillClsx = clsx('pill', className);

    return <div {...rest} className={pillClsx} />;
};

export { Pill };
