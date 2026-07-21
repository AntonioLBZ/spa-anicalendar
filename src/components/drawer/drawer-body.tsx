import clsx from 'clsx';

import type { DrawerBodyProps } from './drawer.types';

const DrawerBody = (props: DrawerBodyProps) => {
    const { className, children, ...rest } = props;

    const drawerBodyClsx = clsx('drawer__body', className);

    return (
        <div className={drawerBodyClsx} {...rest}>
            {children}
        </div>
    );
};

export { DrawerBody };
