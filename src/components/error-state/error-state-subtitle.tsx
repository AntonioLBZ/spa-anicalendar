import clsx from 'clsx';

import type { ErrorStateSubtitleProps } from './error-state.types';

const ErrorStateSubtitle = (props: ErrorStateSubtitleProps) => {
    const { className, ...rest } = props;

    const subtitleClsx = clsx('error-state__subtitle', 'body-l', className);

    return <p {...rest} className={subtitleClsx} />;
};

export { ErrorStateSubtitle };
