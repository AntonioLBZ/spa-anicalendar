'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode } from 'react';

import { SettingsProvider, UserContextProvider, useSettingsContext } from '@/contexts';
import { queryClient } from '@/lib/query-client';

const ThemedBody = (props: { children: ReactNode }) => {
    const { children } = props;
    const { resolvedTheme: theme } = useSettingsContext();

    return (
        <body data-theme={theme} suppressHydrationWarning>
            {children}
        </body>
    );
};

const Providers = (props: { children: ReactNode }) => {
    const { children } = props;

    return (
        <QueryClientProvider client={queryClient}>
            <UserContextProvider>
                <SettingsProvider>
                    <ThemedBody>{children}</ThemedBody>
                </SettingsProvider>
            </UserContextProvider>
        </QueryClientProvider>
    );
};

export { Providers };
