import type { ButtonProps as AriaButtonProps } from 'react-aria-components';

type ButtonProps = AriaButtonProps & {
    variant?: 'primary' | 'ghost';
    size?: 's' | 'm';
    ref?: React.Ref<HTMLButtonElement>;
};

export type { ButtonProps };
