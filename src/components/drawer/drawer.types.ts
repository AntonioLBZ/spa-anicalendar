import type { ModalOverlayProps } from 'react-aria-components';

type DrawerRootProps = Omit<ModalOverlayProps, 'children'> & {
    children: React.ReactNode;
    placement?: 'right' | 'left';
};

type DrawerHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
    ref?: React.Ref<HTMLDivElement>;
};

type DrawerBodyProps = React.HTMLAttributes<HTMLDivElement> & {
    ref?: React.Ref<HTMLDivElement>;
};

export type { DrawerRootProps, DrawerHeaderProps, DrawerBodyProps };
