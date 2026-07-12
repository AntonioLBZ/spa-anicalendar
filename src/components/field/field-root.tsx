import clsx from 'clsx';
import { TextField } from 'react-aria-components';

import type { FieldRootProps } from './field.types';

import './field.css';

const FieldRoot = (props: FieldRootProps) => {
    const { className, validationBehavior = 'aria', ...rest } = props;

    const rootClsx = clsx('field', className);

    return <TextField {...rest} validationBehavior={validationBehavior} className={rootClsx} />;
};

export { FieldRoot };
