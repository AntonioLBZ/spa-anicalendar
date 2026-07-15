import clsx from 'clsx';

import type { ErrorStateActionsProps } from './error-state.types';

const ErrorStateActions = (props: ErrorStateActionsProps) => {
    const { className, ...rest } = props;

    const actionsClsx = clsx('error-state__actions', className);

    return <div {...rest} className={actionsClsx} />;
};

export { ErrorStateActions };
