import type { ToggleButtonProps as AriaToggleButtonProps } from 'react-aria-components';

type ToggleButtonProps = AriaToggleButtonProps & {
    ref?: React.Ref<HTMLButtonElement>;
};

export type { ToggleButtonProps };
