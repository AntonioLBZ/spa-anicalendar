'use client';

import { useCallback, useRef } from 'react';
import { DialogTrigger } from 'react-aria-components';

import { DrawerOnOpenChangeContext } from './drawer-context';

import type { DrawerProps } from './drawer.types';

const Drawer = (props: DrawerProps) => {
    const { children, isOpen, defaultOpen, onOpenChange: rootOnOpenChange } = props;
    const handlerRef = useRef<((isOpen: boolean) => void) | undefined>(undefined);
    const onOpenChange = useCallback(
        (nextIsOpen: boolean) => {
            handlerRef.current?.(nextIsOpen);
            rootOnOpenChange?.(nextIsOpen);
        },
        [rootOnOpenChange]
    );

    return (
        <DrawerOnOpenChangeContext.Provider value={handlerRef}>
            <DialogTrigger isOpen={isOpen} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
                {children}
            </DialogTrigger>
        </DrawerOnOpenChangeContext.Provider>
    );
};

export { Drawer };
