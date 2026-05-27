import clsx from 'clsx';
import { Input } from 'react-aria-components';

import type { FieldInputProps } from './field.types';

const FieldInput = (props: FieldInputProps) => {
    const { className, ...rest } = props;

    const inputClsx = clsx('field__input', 'body-l', className);

    return <Input {...rest} className={inputClsx} placeholder=" " />;
};

export { FieldInput };
