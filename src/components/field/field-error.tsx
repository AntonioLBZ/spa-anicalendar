import clsx from 'clsx';
import { FieldError as AriaFieldError } from 'react-aria-components';

import type { FieldErrorProps } from './field.types';

const FieldError = (props: FieldErrorProps) => {
    const { className, ...rest } = props;

    const errorClsx = clsx('field__error', 'body-m', className);

    return <AriaFieldError {...rest} className={errorClsx} />;
};

export { FieldError };
