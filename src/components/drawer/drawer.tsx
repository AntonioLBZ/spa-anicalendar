import clsx from 'clsx';
import { Dialog, Modal, ModalOverlay } from 'react-aria-components';

import type { DrawerRootProps } from './drawer.types';

import './drawer.css';

const DrawerRoot = (props: DrawerRootProps) => {
    const { className, children, placement = 'right', ...rest } = props;

    const drawerClsx = clsx('drawer', `drawer--${placement}`, className);

    return (
        <ModalOverlay isDismissable {...rest} className="drawer__overlay">
            <Modal className={drawerClsx}>
                <Dialog>{children}</Dialog>
            </Modal>
        </ModalOverlay>
    );
};

export { DrawerRoot };
