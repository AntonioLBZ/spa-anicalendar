'use client';

import { Body, Button, Header } from '@/components';
import { useThemeContext } from './providers';
import { AlcCard } from '@/modules/alc-ard/alc-ard';

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
                    <AlcCard />
                </Body>
            </main>
        </>
    );
}
