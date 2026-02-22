import clsx from 'clsx';

import type { HeaderRootProps } from './header.types';

import './header.css';

const HeaderRoot = (props: HeaderRootProps) => {
    const { children, className } = props;
    const headerClsx = clsx('header', className);

    return <header className={headerClsx}>{children}</header>;
};

export { HeaderRoot };
