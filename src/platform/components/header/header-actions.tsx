import clsx from 'clsx';

import type { HeaderActionsProps } from './header.types';

const HeaderActions = (props: HeaderActionsProps) => {
    const { children, className } = props;
    const actionsClsx = clsx('header__actions', className);

    return <div className={actionsClsx}>{children}</div>;
};

export { HeaderActions };
