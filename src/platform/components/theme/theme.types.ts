type ThemeProps = React.ComponentPropsWithRef<'div'>;

type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
    theme?: ThemeMode;
    setTheme?: (theme: ThemeMode) => void;
}

export type { ThemeProps, ThemeMode, ThemeContextValue };
