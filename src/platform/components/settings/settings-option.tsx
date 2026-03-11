import clsx from 'clsx';

import type { SettingsOptionProps } from './settings.types';

const SettingsOption = (props: SettingsOptionProps) => {
    const { children, className, isSelected, ...rest } = props;
    const optionClsx = clsx(
        'settings__option',
        'body-2',
        { 'settings__option--selected': isSelected },
        className
    );

    return (
        <div className={optionClsx} {...rest}>
            {children}
        </div>
    );
};

export { SettingsOption };
