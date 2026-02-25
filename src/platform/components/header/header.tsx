import clsx from 'clsx';

import type { HeaderRootProps } from './header.types';

import './header.css';

const HeaderRoot = (props: HeaderRootProps) => {
    const { children, className, ...rest } = props;
    const headerClsx = clsx('header', className);

    return (
        <header className={headerClsx} {...rest}>
            {children}
        </header>
    );
};

export { HeaderRoot };
