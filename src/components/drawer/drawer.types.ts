import type { ModalOverlayProps } from 'react-aria-components';

type DrawerRootProps = Omit<ModalOverlayProps, 'children'> & {
    children: React.ReactNode;
    /** Edge the sheet slides in from. `bottom` is a full-width sheet capped at 85% of the viewport height, meant for small screens.
     * @default 'right'
     */
    placement?: 'right' | 'left' | 'bottom';
};

type DrawerHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
    ref?: React.Ref<HTMLDivElement>;
};

type DrawerBodyProps = React.HTMLAttributes<HTMLDivElement> & {
    ref?: React.Ref<HTMLDivElement>;
};

export type { DrawerRootProps, DrawerHeaderProps, DrawerBodyProps };
