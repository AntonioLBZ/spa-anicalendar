'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect, type ReactNode } from 'react';

import { SettingsProvider, UserContextProvider, useSettingsContext } from '@/contexts';
import { queryClient } from '@/lib/query-client';

const ThemedBody = (props: { children: ReactNode }) => {
    const { children } = props;
    const { resolvedTheme: theme, accentColor } = useSettingsContext();

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        document.documentElement.dataset.accent = accentColor;
    }, [theme, accentColor]);

    return (
        <body data-theme={theme} data-accent={accentColor} suppressHydrationWarning>
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
