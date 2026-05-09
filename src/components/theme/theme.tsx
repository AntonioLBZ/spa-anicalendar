'use client';

import clsx from 'clsx';
import { useSyncExternalStore } from 'react';

import { useSettingsContext } from '@/contexts/settings-context';

import type { ThemeMode, ThemeProps } from './theme.types';

const preferDarkThemeQuery = () => globalThis.matchMedia('(prefers-color-scheme: dark)');

const useResolvedTheme = (theme: ThemeMode): 'light' | 'dark' => {
    const systemPreference = useSyncExternalStore(
        (cb) => {
            const mq = preferDarkThemeQuery();
            mq.addEventListener('change', cb);
            return () => mq.removeEventListener('change', cb);
        },
        () => (preferDarkThemeQuery().matches ? 'dark' : 'light'),
        () => 'dark' as const
    );
    return theme === 'system' ? systemPreference : theme;
};

const Theme = (props: ThemeProps) => {
    const { children, className, ...rest } = props;
    const { theme } = useSettingsContext();
    const resolvedTheme = useResolvedTheme(theme);

    const themeClsx = clsx(
        'theme-root',
        {
            'theme-root--light': resolvedTheme === 'light',
        },
        className
    );

    return (
        <div className={themeClsx} {...rest}>
            {children}
        </div>
    );
};

export { Theme };
