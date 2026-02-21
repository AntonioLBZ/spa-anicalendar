type CardTitleProps = React.ComponentPropsWithRef<'div'> & {
    /* Content to be displayed inside the card title */
    children?: React.ReactNode;
    /* Optional additional CSS classes for the card */
    className?: string;
};

export type { CardTitleProps };
