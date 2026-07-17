import type { ButtonProps as AriaButtonProps } from 'react-aria-components';

type ButtonProps = AriaButtonProps & {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 's' | 'm';
    ref?: React.Ref<HTMLButtonElement>;
};

export type { ButtonProps };
