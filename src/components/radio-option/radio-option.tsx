import clsx from 'clsx';
import { Radio } from 'react-aria-components';

import type { RadioOptionProps } from './radio-option.types';

const RadioOption = (props: RadioOptionProps) => {
    const { className, ...rest } = props;

    const optionClsx = clsx('radio-option', 'body-m', className);

    return <Radio {...rest} className={optionClsx} />;
};

export { RadioOption };
