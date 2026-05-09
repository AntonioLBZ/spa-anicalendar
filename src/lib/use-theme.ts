import { useSyncExternalStore } from 'react';

import { ThemeMode } from '@/contexts';

const preferDarkThemeQuery = () => globalThis.matchMedia('(prefers-color-scheme: dark)');

const useResolvedTheme = () => {
    const systemPreference = useSyncExternalStore(
        (cb) => {
            const mq = preferDarkThemeQuery();
            mq.addEventListener('change', cb);
            return () => mq.removeEventListener('change', cb);
        },
        () => (preferDarkThemeQuery().matches ? 'dark' : 'light'),
        () => 'dark' as const
    );
    return (theme: ThemeMode) => (theme === 'system' ? systemPreference : theme);
};

export { useResolvedTheme };
