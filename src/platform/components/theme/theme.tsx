'use client';

import { useState } from 'react';
import { createContext } from '@/platform/lib/context';
import { ThemeMode, ThemeContextValue } from './theme.types';
import clsx from 'clsx';
import { ThemeProps } from './theme.types';

const [ThemeContext, useThemeContext] = createContext<ThemeContextValue>({});

const Theme = (props: ThemeProps) => {
    const { children, className, ...rest } = props;
    const [theme, setTheme] = useState<ThemeMode>('dark');

    const themeClsx = clsx(
        'theme-root',
        {
            'theme-root--light': theme === 'light',
        },
        className
    );

    return (
        <div className={themeClsx} {...rest}>
            <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
        </div>
    );
};

export { useThemeContext, Theme };
