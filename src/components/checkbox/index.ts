import { Checkbox as CheckboxOption } from './checkbox';
import { CheckboxGroup } from './checkbox-group';

import './checkbox.css';

const Checkbox = {
    Option: CheckboxOption,
    Group: CheckboxGroup,
};

export { Checkbox };
export type { CheckboxGroupProps, CheckboxProps } from './checkbox.types';
