import clsx from 'clsx';

import type { SettingsSectionProps } from './settings.types';

const SettingsSection = (props: SettingsSectionProps) => {
    const { children, className, isDisabled, ...rest } = props;
    const sectionClsx = clsx(
        'settings__section',
        { 'settings__section--disabled': isDisabled },
        className
    );

    return (
        <section className={sectionClsx} {...rest}>
            {children}
        </section>
    );
};

export { SettingsSection };
