import clsx from 'clsx';
import { CheckboxGroup as AriaCheckboxGroup } from 'react-aria-components';

import type { CheckboxGroupProps } from './checkbox.types';

const CheckboxGroup = <T extends string = string>(props: CheckboxGroupProps<T>) => {
    const { className, onChange, ...rest } = props;

    const groupClsx = clsx('checkbox-group', className);
    const handleChange = onChange as (value: string[]) => void;

    return <AriaCheckboxGroup {...rest} onChange={handleChange} className={groupClsx} />;
};

export { CheckboxGroup };
