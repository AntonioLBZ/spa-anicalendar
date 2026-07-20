import clsx from 'clsx';
import { Button } from 'react-aria-components';

import type { DrawerTriggerProps } from './drawer.types';

const DrawerTrigger = (props: DrawerTriggerProps) => {
    const { className, children, ...rest } = props;

    return (
        <Button {...rest} className={clsx('drawer__trigger', className)}>
            {children}
        </Button>
    );
};

export { DrawerTrigger };
