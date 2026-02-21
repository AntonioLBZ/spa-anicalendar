import React from 'react';
import { createContext } from '@/platform/lib/context';
import { TTheme, IThemeContext } from './theme.types';
import clsx from 'clsx';
import { TThemeProps } from './theme.types';

const [ThemeContext, useThemeContext] = createContext<IThemeContext>({});

const Theme = (props: TThemeProps) => {
    const { children, className, ...rest } = props;
    const [theme, setTheme] = React.useState<TTheme>('dark');

    const themeClsx = clsx(
        'alc',
        {
            'alc-light': theme === 'light',
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
