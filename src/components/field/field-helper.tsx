import clsx from 'clsx';
import { Text } from 'react-aria-components';

import type { FieldHelperProps } from './field.types';

const FieldHelper = (props: FieldHelperProps) => {
    const { className, ...rest } = props;

    const helperClsx = clsx('field__helper', 'body-m', className);

    return <Text {...rest} slot="description" className={helperClsx} />;
};

export { FieldHelper };
