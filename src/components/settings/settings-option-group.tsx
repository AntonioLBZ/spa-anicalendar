import clsx from 'clsx';

import type { SettingsOptionGroupProps } from './settings.types';

const SettingsOptionGroup = (props: SettingsOptionGroupProps) => {
    const { children, className, ...rest } = props;
    const groupClsx = clsx('settings__option-group', className);

    return (
        <div className={groupClsx} {...rest}>
            {children}
        </div>
    );
};

export { SettingsOptionGroup };
