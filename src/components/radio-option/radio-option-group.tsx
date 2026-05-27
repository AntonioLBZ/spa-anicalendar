import clsx from 'clsx';
import { RadioGroup } from 'react-aria-components';

import type { RadioOptionGroupProps } from './radio-option.types';

const RadioOptionGroup = <T extends string = string>(props: RadioOptionGroupProps<T>) => {
    const { className, onChange, orientation = 'horizontal', ...rest } = props;

    const groupClsx = clsx('radio-option-group', className);
    const handleChange = onChange as (value: string) => void;

    return <RadioGroup {...rest} onChange={handleChange} className={groupClsx} orientation={orientation} />;
};

export { RadioOptionGroup };
