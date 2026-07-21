import type { CheckboxGroupProps as AriaCheckboxGroupProps, CheckboxProps as AriaCheckboxProps } from 'react-aria-components';

type CheckboxGroupProps<T extends string = string> = Omit<AriaCheckboxGroupProps, 'onChange' | 'value' | 'defaultValue'> & {
    ref?: React.Ref<HTMLDivElement>;
    value?: T[];
    defaultValue?: T[];
    onChange?: (value: T[]) => void;
};

type CheckboxProps = Omit<AriaCheckboxProps, 'children'> & {
    children?: React.ReactNode;
    ref?: React.Ref<HTMLLabelElement>;
};

export type { CheckboxGroupProps, CheckboxProps };
