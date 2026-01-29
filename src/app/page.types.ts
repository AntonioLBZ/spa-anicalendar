type TLayoutRootProps = {
    children: React.ReactNode;
};

type TTheme = 'dark' | 'light';
type TThemeContext = {
    theme?: TTheme;
    setTheme?: (theme: TTheme) => void;
};

export type { TLayoutRootProps, TTheme, TThemeContext };
