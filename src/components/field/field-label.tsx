import clsx from 'clsx';
import { Label } from 'react-aria-components';

import type { FieldLabelProps } from './field.types';

const FieldLabel = (props: FieldLabelProps) => {
    const { className, ...rest } = props;

    const labelClsx = clsx('field__label', className);

    return <Label {...rest} className={labelClsx} />;
};

export { FieldLabel };
