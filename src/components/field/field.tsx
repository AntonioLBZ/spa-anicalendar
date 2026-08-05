import clsx from 'clsx';
import { TextField } from 'react-aria-components';

import { FieldStateContext } from './field-context';

import type { FieldRootProps } from './field.types';

import './field.css';

const FieldRoot = (props: FieldRootProps) => {
    const { className, validationBehavior = 'aria', value, onChange, ...rest } = props;

    const rootClsx = clsx('field', className);
    const fieldState = { value: value ?? '', clear: () => onChange?.('') };

    return (
        <FieldStateContext.Provider value={fieldState}>
            <TextField
                {...rest}
                value={value}
                onChange={onChange}
                validationBehavior={validationBehavior}
                className={rootClsx}
            />
        </FieldStateContext.Provider>
    );
};

export { FieldRoot };
