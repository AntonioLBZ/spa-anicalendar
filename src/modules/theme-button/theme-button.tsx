import { Button, useThemeContext } from '@/platform/components';

const ThemeButton = () => {
    const { theme, setTheme } = useThemeContext();

    const handleChangeTheme = () => {
        setTheme?.(theme === 'dark' ? 'light' : 'dark');
    };

    return <Button onClick={handleChangeTheme}>Set {theme === 'dark' ? 'Light' : 'Dark'} Theme</Button>;
};

export { ThemeButton };
