import clsx from 'clsx';
import { Button } from 'react-aria-components';

import type { SettingsTriggerProps } from './settings.types';

import './settings.css';

const SettingsTrigger = (props: SettingsTriggerProps) => {
    const { children, className, ...rest } = props;
    const triggerClsx = clsx('settings__trigger', className);

    return (
        <Button className={triggerClsx} {...rest}>
            {children}
        </Button>
    );
};

export { SettingsTrigger };
