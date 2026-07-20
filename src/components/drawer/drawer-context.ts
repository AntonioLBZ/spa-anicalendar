import { createContext } from 'react';

type OnOpenChangeRef = React.MutableRefObject<((isOpen: boolean) => void) | undefined>;

// RAC ignores `onOpenChange` on `Modal`/`ModalOverlay` when their state is controlled by a
// `DialogTrigger` (it must live on the trigger). `Drawer.Panel` exposes the prop for ergonomics,
// so we bridge it up to the root `DialogTrigger` through this ref-backed context.
const DrawerOnOpenChangeContext = createContext<OnOpenChangeRef | null>(null);

export { DrawerOnOpenChangeContext };
export type { OnOpenChangeRef };
