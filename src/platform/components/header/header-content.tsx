import clsx from 'clsx';

import type { HeaderContentProps } from './header.types';

const HeaderContent = (props: HeaderContentProps) => {
    const { children, className, ...rest } = props;
    const contentClsx = clsx('header__content', className);

    return (
        <div className={contentClsx} {...rest}>
            {children}
        </div>
    );
};

export { HeaderContent };
