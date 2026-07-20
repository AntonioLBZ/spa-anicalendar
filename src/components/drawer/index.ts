import { Drawer as DrawerRoot } from './drawer';
import { DrawerPanel } from './drawer-panel';
import { DrawerTrigger } from './drawer-trigger';

import './drawer.css';

const Drawer = Object.assign(DrawerRoot, {
    Trigger: DrawerTrigger,
    Panel: DrawerPanel,
});

export { Drawer };
export type { DrawerProps, DrawerTriggerProps, DrawerPanelProps } from './drawer.types';
