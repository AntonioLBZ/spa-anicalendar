import type { ButtonProps as AriaButtonProps, ModalOverlayProps as AriaModalOverlayProps } from 'react-aria-components';

type DrawerProps = {
    children: React.ReactNode;
    /** Controlled open state, forwarded to the underlying RAC `DialogTrigger`. */
    isOpen?: boolean;
    defaultOpen?: boolean;
    /**
     * Fires whenever the drawer opens or closes, whatever the cause (trigger click, Escape,
     * backdrop click, or a controlled `isOpen` change). Combined with `Drawer.Panel`'s
     * `onOpenChange` — both fire.
     */
    onOpenChange?: (isOpen: boolean) => void;
};

type DrawerTriggerProps = Omit<AriaButtonProps, 'children' | 'className'> & {
    children?: React.ReactNode;
    className?: string;
    ref?: React.Ref<HTMLButtonElement>;
};

type DrawerPanelProps = Omit<AriaModalOverlayProps, 'children' | 'className' | 'onOpenChange'> & {
    children?: React.ReactNode;
    className?: string;
    /**
     * @default: 'right'
     */
    placement?: 'right' | 'left';
    /**
     * Forwarded to the underlying RAC `DialogTrigger` so callers can react to dismiss
     * (Escape / backdrop click), not only to an explicit close. Needed because RAC `Modal`
     * unmounts its children on close, discarding any uncommitted local state in them.
     */
    onOpenChange?: (isOpen: boolean) => void;
    /** Accessible label for the panel's built-in top-right close button. */
    closeButtonLabel: string;
};

export type { DrawerProps, DrawerTriggerProps, DrawerPanelProps };
