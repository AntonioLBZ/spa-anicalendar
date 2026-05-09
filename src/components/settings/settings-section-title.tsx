import clsx from 'clsx';

import type { SettingsSectionTitleProps } from './settings.types';

const SettingsSectionTitle = (props: SettingsSectionTitleProps) => {
    const { children, className, ...rest } = props;
    const titleClsx = clsx('settings__section-title', 'label-2', className);

    return (
        <h3 className={titleClsx} {...rest}>
            {children}
        </h3>
    );
};

export { SettingsSectionTitle };
