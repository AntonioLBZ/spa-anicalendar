import clsx from 'clsx';

import type { FieldControlProps } from './field.types';

const FieldControl = (props: FieldControlProps) => {
    const { className, ...rest } = props;

    const controlClsx = clsx('field__control', className);

    return <div {...rest} className={controlClsx} />;
};

export { FieldControl };
