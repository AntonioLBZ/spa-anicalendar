'use client';

import { Body, Button, Card, Header } from '@/components';
import { useThemeContext } from './providers';

export default function Home() {
    const { theme, setTheme } = useThemeContext();

    const handleChangeTheme = () => {
        setTheme?.(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <>
            <Header />
            <main>
                <Body>
                    <Button onClick={handleChangeTheme}>Toggle Theme</Button>
                    {theme}
                    <Card />
                </Body>
            </main>
        </>
    );
}
