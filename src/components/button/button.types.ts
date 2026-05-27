import type { ButtonProps as AriaButtonProps } from 'react-aria-components';

type ButtonProps = AriaButtonProps & {
    variant?: 'primary' | 'ghost';
    ref?: React.Ref<HTMLButtonElement>;
};

export type { ButtonProps };
