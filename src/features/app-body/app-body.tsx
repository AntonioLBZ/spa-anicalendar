'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import clsx from 'clsx';
import { ReactNode } from 'react';

import { SettingsProvider, UserContextProvider, useSettingsContext } from '../../contexts';
import { queryClient } from '../../lib/query-client';

import type { AppBodyProps } from './app-body.types';

import './app-body.css';
import '@/assets/themes.css';
import '@/assets/typography.css';

const AppProvider = (props: { children: ReactNode }) => {
    const { children } = props;

    return (
        <QueryClientProvider client={queryClient}>
            <UserContextProvider>
                <SettingsProvider>
                    <AppBody>{children}</AppBody>
                </SettingsProvider>
            </UserContextProvider>
        </QueryClientProvider>
    );
};

const AppBody = (props: AppBodyProps) => {
    const { children, className, ...rest } = props;
    const appBodyClsx = clsx('app-body', className);

    const { resolvedTheme: theme } = useSettingsContext();

    return (
        <body className={appBodyClsx} {...rest} data-theme={theme}>
            <div className="app-body__content">{children}</div>
        </body>
    );
};

export { AppProvider as Body };
