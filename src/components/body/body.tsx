'use client';
import { QueryClientProvider } from '@tanstack/react-query';
import { clsx } from 'clsx';
import { ReactNode } from 'react';

import { SettingsProvider, UserContextProvider, useSettingsContext } from '@/contexts';
import { queryClient } from '@/lib/query-client';

import { BodyProps } from './body.types';

const AppProvider = (props: { children: ReactNode }) => {
    const { children } = props;

    return (
        <QueryClientProvider client={queryClient}>
            <UserContextProvider>
                <SettingsProvider>
                    <Body>{children}</Body>
                </SettingsProvider>
            </UserContextProvider>
        </QueryClientProvider>
    );
};

const Body = (props: BodyProps) => {
    const { children, className, ...rest } = props;
    const bodyClsx = clsx('app-body', className);

    const { resolvedTheme: theme } = useSettingsContext();

    return (
        <body className={bodyClsx} {...rest} data-theme={theme}>
            {children}
        </body>
    );
};

export { AppProvider as Body };
