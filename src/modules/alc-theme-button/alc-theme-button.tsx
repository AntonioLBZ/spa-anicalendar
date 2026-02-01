import { Button, useThemeContext } from '@/components';

const AlcThemeButton = () => {
    const { theme, setTheme } = useThemeContext();

    const handleChangeTheme = () => {
        setTheme?.(theme === 'dark' ? 'light' : 'dark');
    };

    return <Button onClick={handleChangeTheme}>Set {theme === 'dark' ? 'Light' : 'Dark'} Theme</Button>;
};

export { AlcThemeButton };
