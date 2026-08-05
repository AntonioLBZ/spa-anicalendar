import clsx from 'clsx';

import { Button } from '../button';
import { DismissIcon } from '../icons';
import { useFieldState } from './field-context';

import type { FieldClearProps } from './field.types';

const FieldClear = (props: FieldClearProps) => {
    const { className, ...rest } = props;

    const fieldState = useFieldState();

    if (!fieldState?.value) return null;

    const clearClsx = clsx('field__clear', className);

    return (
        <Button type="button" variant="ghost" size="s" className={clearClsx} onPress={fieldState.clear} {...rest}>
            <DismissIcon />
        </Button>
    );
};

export { FieldClear };
