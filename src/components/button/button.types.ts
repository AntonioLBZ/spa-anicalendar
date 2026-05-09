import type { ButtonProps as AriaButtonProps } from 'react-aria-components';

type ButtonProps = AriaButtonProps & {
    variant?: 'primary' | 'ghost';
};

export type { ButtonProps };
