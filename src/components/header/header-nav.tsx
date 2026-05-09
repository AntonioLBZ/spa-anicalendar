import clsx from 'clsx';

import type { HeaderNavProps } from './header.types';

const HeaderNav = (props: HeaderNavProps) => {
    const { children, className, ...rest } = props;
    const navClsx = clsx('header__nav', className);

    return (
        <nav className={navClsx} {...rest}>
            {children}
        </nav>
    );
};

export { HeaderNav };
