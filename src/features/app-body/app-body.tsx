'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import clsx from 'clsx';

import { Theme } from '@/components';
import { SettingsProvider } from '@/contexts/settings-context';
import { UserContextProvider } from '@/contexts/user-context';
import { queryClient } from '@/lib/query-client';

import type { AppBodyProps } from './app-body.types';

import './app-body.css';
import '@/assets/themes.css';
import '@/assets/typography.css';

const AppBody = (props: AppBodyProps) => {
    const { children, className, ...rest } = props;
    const appBodyClsx = clsx('app-body', className);
    return (
        <div className={appBodyClsx} {...rest}>
            <div className="app-body__content">
                <QueryClientProvider client={queryClient}>
                    <UserContextProvider>
                        <SettingsProvider>
                            <Theme>{children}</Theme>
                        </SettingsProvider>
                    </UserContextProvider>
                </QueryClientProvider>
            </div>
        </div>
    );
};

export { AppBody };
