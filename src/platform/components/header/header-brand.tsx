import clsx from 'clsx';

import type { HeaderBrandProps } from './header.types';

const HeaderBrand = (props: HeaderBrandProps) => {
    const { children, className, ...rest } = props;
    const brandClsx = clsx('header__brand', className);

    return (
        <div className={brandClsx} {...rest}>
            {children}
        </div>
    );
};

export { HeaderBrand };
