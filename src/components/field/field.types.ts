import type { InputProps as AriaInputProps, LabelProps as AriaLabelProps, TextFieldProps } from 'react-aria-components';

type FieldRootProps = TextFieldProps & {
    ref?: React.Ref<HTMLDivElement>;
};

type FieldInputProps = AriaInputProps & {
    ref?: React.Ref<HTMLInputElement>;
};

type FieldLabelProps = AriaLabelProps & {
    ref?: React.Ref<HTMLLabelElement>;
};

export type { FieldRootProps, FieldInputProps, FieldLabelProps };
