import clsx from 'clsx';
import { useContext } from 'react';
import { ModalContext, useContextProps } from 'react-aria-components';

import type { DrawerHeaderProps } from './drawer.types';

const DrawerHeader = (props: DrawerHeaderProps) => {
    const { className, children, ...rest } = props;

    const drawerHeaderClsx = clsx('drawer__header', 'label-l', className);

    return (
        <div className={drawerHeaderClsx} {...rest}>
            {children}
        </div>
    );
};

export { DrawerHeader };
