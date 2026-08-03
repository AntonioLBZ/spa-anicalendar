import { FieldRoot } from './field';
import { FieldClear } from './field-clear';
import { FieldControl } from './field-control';
import { FieldError } from './field-error';
import { FieldHelper } from './field-helper';
import { FieldInput } from './field-input';
import { FieldLabel } from './field-label';

const Field = {
    Root: FieldRoot,
    Control: FieldControl,
    Input: FieldInput,
    Label: FieldLabel,
    Error: FieldError,
    Helper: FieldHelper,
    Clear: FieldClear,
};

export { Field };
export type {
    FieldRootProps,
    FieldControlProps,
    FieldInputProps,
    FieldLabelProps,
    FieldErrorProps,
    FieldHelperProps,
    FieldClearProps,
} from './field.types';
