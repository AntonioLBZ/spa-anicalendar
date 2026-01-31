type TThemeProps = React.ComponentPropsWithRef<'div'>;

type TTheme = 'light' | 'dark';

interface IThemeContext {
    theme?: TTheme;
    setTheme?: (theme: TTheme) => void;
}

export type { TThemeProps, TTheme, IThemeContext as TThemeContext };
