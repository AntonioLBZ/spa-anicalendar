'use client';

import React from 'react';
import { createContext } from '@/platform/lib/context';
import { TTheme, TThemeContext } from './page.types';
import clsx from 'clsx';

const [ThemeContext, useThemeContext] = createContext<TThemeContext>({});

export interface ProvidersProps {
    children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
    const [theme, setTheme] = React.useState<TTheme>('dark');

    const layoutClsx = clsx('alc', {
        'alc-light': theme === 'light',
    });

    return (
        <body className={layoutClsx}>
            <ThemeContext.Provider value={{ theme, setTheme }}>
                {children}
            </ThemeContext.Provider>
        </body>
    );
};

export { useThemeContext };
