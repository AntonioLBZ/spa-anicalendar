'use client';

import clsx from 'clsx';
import { useContext, useEffect } from 'react';
import { Dialog, Modal, ModalOverlay } from 'react-aria-components';

import { Button } from '../button';
import { DismissIcon } from '../icons';
import { DrawerOnOpenChangeContext } from './drawer-context';

import type { DrawerPanelProps } from './drawer.types';

const DrawerPanel = (props: DrawerPanelProps) => {
    const { className, children, placement = 'right', onOpenChange, closeButtonLabel, ...rest } = props;

    const handlerRef = useContext(DrawerOnOpenChangeContext);
    useEffect(() => {
        if (!handlerRef) return;
        handlerRef.current = onOpenChange;
    });

    return (
        <ModalOverlay isDismissable {...rest} className="drawer__overlay">
            <Modal className={clsx('drawer__panel', `drawer__panel--${placement}`, className)}>
                <Dialog className="drawer__dialog">
                    {({ close }) => (
                        <>
                            <div className="drawer__header">
                                <Button variant="ghost" size="s" onPress={close} aria-label={closeButtonLabel}>
                                    <DismissIcon />
                                </Button>
                            </div>
                            {children}
                        </>
                    )}
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
};

export { DrawerPanel };
