import type {
    FieldErrorProps as AriaFieldErrorProps,
    InputProps as AriaInputProps,
    LabelProps as AriaLabelProps,
    TextFieldProps,
    TextProps as AriaTextProps,
} from 'react-aria-components';

type FieldRootProps = TextFieldProps & {
    ref?: React.Ref<HTMLDivElement>;
};

type FieldInputProps = AriaInputProps & {
    ref?: React.Ref<HTMLInputElement>;
};

type FieldLabelProps = AriaLabelProps & {
    ref?: React.Ref<HTMLLabelElement>;
};

type FieldErrorProps = AriaFieldErrorProps & {
    ref?: React.Ref<HTMLElement>;
};

type FieldControlProps = React.HTMLAttributes<HTMLDivElement> & {
    ref?: React.Ref<HTMLDivElement>;
};

type FieldHelperProps = Omit<AriaTextProps, 'slot'> & {
    ref?: React.Ref<HTMLElement>;
};

export type {
    FieldRootProps,
    FieldInputProps,
    FieldLabelProps,
    FieldErrorProps,
    FieldControlProps,
    FieldHelperProps,
};
