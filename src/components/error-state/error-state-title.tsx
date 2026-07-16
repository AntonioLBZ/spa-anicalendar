import clsx from 'clsx';

import type { ErrorStateTitleProps } from './error-state.types';

const ErrorStateTitle = (props: ErrorStateTitleProps) => {
    const { className, ...rest } = props;

    const titleClsx = clsx('error-state__title', 'title-m', className);

    return <p {...rest} className={titleClsx} />;
};

export { ErrorStateTitle };
