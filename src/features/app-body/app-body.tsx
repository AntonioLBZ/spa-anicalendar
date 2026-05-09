'use client';

import clsx from 'clsx';

import { Theme } from '@/components';
import { SettingsProvider } from '@/contexts/settings-context';
import { UserContextProvider } from '@/contexts/user-context';

import type { AppBodyProps } from './app-body.types';

import './app-body.css';
import '@/assets/themes.css';
import '@/assets/fonts/fonts.css';
import '@/assets/typography.css';

const AppBody = (props: AppBodyProps) => {
    const { children, className, ...rest } = props;
    const appBodyClsx = clsx('app-body', className);
    return (
        <div className={appBodyClsx} {...rest}>
            <div className="app-body__content">
                <UserContextProvider>
                    <SettingsProvider>
                        <Theme>{children}</Theme>
                    </SettingsProvider>
                </UserContextProvider>
            </div>
        </div>
    );
};

export { AppBody };
