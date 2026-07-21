import { DrawerRoot } from './drawer';
import { DrawerBody } from './drawer-body';
import { DrawerHeader } from './drawer-header';

const Drawer = {
    Root: DrawerRoot,
    Header: DrawerHeader,
    Body: DrawerBody,
};

export { Drawer };
export { DialogTrigger as DrawerTrigger } from 'react-aria-components';
export type { DialogTriggerProps as DrawerTriggerProps } from 'react-aria-components';
export type { DrawerRootProps, DrawerHeaderProps } from './drawer.types';
