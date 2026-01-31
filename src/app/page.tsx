'use client';

import { Body, Button, Header } from '@/components';
import { useThemeContext } from './providers';
import { AlcCard } from '@/modules/alc-card/alc-card';
import { UserProfile } from '@/modules/user-profile/user-profile';
import { getUserByName } from '@/services/api';
import { useRouter } from 'next/navigation';

export default function Home() {
    const { theme, setTheme } = useThemeContext();
    const router = useRouter();

    const handleChangeTheme = () => {
        setTheme?.(theme === 'dark' ? 'light' : 'dark');
    };

    const setUserName = (name: string) => {
        router.push(`/${name}`);
    };

    return (
        <>
            <Header />
            <main>
                <Body>
                    <Button onClick={handleChangeTheme}>Toggle Theme</Button>
                    {theme}
                    <Button onClick={() => setUserName('LanZor')}>
                        Go to LanZor's Profile
                    </Button>
                    <br />
                    <br />
                    <AlcCard />
                </Body>
            </main>
        </>
    );
}
