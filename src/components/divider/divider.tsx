import { clsx } from 'clsx';
import { Separator } from 'react-aria-components';

import type { DividerProps } from './divider.types';

import './divider.css';

const Divider = (props: DividerProps) => {
    const { className, ...rest } = props;

    const dividerClsx = clsx('divider', className);

    return <Separator {...rest} className={dividerClsx} />;
};

export { Divider };
