'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { useLayoutEffect, type ReactNode } from 'react';

import { SettingsProvider, UserContextProvider, useSettingsContext } from '@/contexts';
import { THEME_COLORS } from '@/lib/brand';
import { queryClient } from '@/lib/query-client';

const ThemedBody = (props: { children: ReactNode }) => {
    const { children } = props;
    const { resolvedTheme: theme, resolvedAccentColor: accentColor } = useSettingsContext();

    // Layout effect so <html> updates in the same commit as <body>, before paint
    useLayoutEffect(() => {
        document.documentElement.dataset.theme = theme;
        document.documentElement.dataset.accent = accentColor;
        // Both media-scoped tags, so a theme picked in settings wins over the system's
        document
            .querySelectorAll('meta[name="theme-color"]')
            .forEach((meta) => meta.setAttribute('content', THEME_COLORS[theme]));
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
