import type { RadioGroupProps, RadioProps } from 'react-aria-components';

type RadioOptionGroupProps<T extends string = string> = Omit<RadioGroupProps, 'onChange' | 'value' | 'defaultValue'> & {
    ref?: React.Ref<HTMLDivElement>;
    value?: T;
    defaultValue?: T;
    onChange?: (value: T) => void;
    /**
     * @default: 'horizontal'
     */
    orientation?: 'horizontal' | 'vertical';
};

type RadioOptionProps = RadioProps & {
    ref?: React.Ref<HTMLLabelElement>;
};

export type { RadioOptionGroupProps, RadioOptionProps };
