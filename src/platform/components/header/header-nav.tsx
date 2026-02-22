import clsx from 'clsx';

import type { HeaderNavProps } from './header.types';

const HeaderNav = (props: HeaderNavProps) => {
    const { children, className } = props;
    const navClsx = clsx('header__nav', className);

    return <nav className={navClsx}>{children}</nav>;
};

export { HeaderNav };
