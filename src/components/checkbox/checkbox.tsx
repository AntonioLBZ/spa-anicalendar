import clsx from 'clsx';
import { Checkbox as AriaCheckbox } from 'react-aria-components';

import { CheckIcon } from './check-icon';

import type { CheckboxProps } from './checkbox.types';

const Checkbox = (props: CheckboxProps) => {
    const { className, children, ...rest } = props;

    const checkboxClsx = clsx('checkbox', 'body-m', className);

    return (
        <AriaCheckbox {...rest} className={checkboxClsx}>
            <span className="checkbox__box" aria-hidden="true">
                <CheckIcon />
            </span>
            {children}
        </AriaCheckbox>
    );
};

export { Checkbox };
