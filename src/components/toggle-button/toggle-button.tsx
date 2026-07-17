import clsx from 'clsx';
import { ToggleButton as AriaToggleButton } from 'react-aria-components';

import type { ToggleButtonProps } from './toggle-button.types';

const ToggleButton = (props: ToggleButtonProps) => {
    const { className, ...rest } = props;

    const toggleButtonClsx = clsx('toggle-button', className);

    return <AriaToggleButton {...rest} className={toggleButtonClsx} />;
};

export { ToggleButton };
