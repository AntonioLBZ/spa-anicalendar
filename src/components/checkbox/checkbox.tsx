import clsx from 'clsx';
import { Checkbox as AriaCheckbox } from 'react-aria-components';

import { CheckboxIcon } from './checkbox-icon';

import type { CheckboxProps } from './checkbox.types';

const Checkbox = (props: CheckboxProps) => {
    const { className, children, ...rest } = props;

    const checkboxClsx = clsx('checkbox', 'body-m', className);

    return (
        <AriaCheckbox {...rest} className={checkboxClsx}>
            {({ isSelected }) => {
                return (
                    <>
                        <CheckboxIcon isSelected={isSelected} />
                        {children}
                    </>
                );
            }}
        </AriaCheckbox>
    );
};

export { Checkbox };
