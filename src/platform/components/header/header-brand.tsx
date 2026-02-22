import clsx from 'clsx';

import type { HeaderBrandProps } from './header.types';

const HeaderBrand = (props: HeaderBrandProps) => {
    const { children, className } = props;
    const brandClsx = clsx('header__brand', className);

    return <div className={brandClsx}>{children}</div>;
};

export { HeaderBrand };
