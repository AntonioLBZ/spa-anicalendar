'use client';

import { AlcCard } from '@/modules/alc-card/alc-card';
import { UserProfile } from '@/modules/user-profile/user-profile';
import { getUserByName, IUserData } from '@/services/api';
import { useParams } from 'next/navigation';
import { useThemeContext } from '../providers';
import { Button } from '@/components';
import React from 'react';

export default function Home() {
    const { theme, setTheme } = useThemeContext();
    const [userData, setUserData] = React.useState<IUserData | null>(null);
    const params = useParams();
    const name = params.user_name as string;

    const handleChangeTheme = () => {
        setTheme?.(theme === 'dark' ? 'light' : 'dark');
    };

    React.useEffect(() => {
        const fetchUser = async () => {
            const userData = await getUserByName(name);
            setUserData(userData);
        };

        fetchUser();
    }, [name]);

    return (
        <main>
            <Button onClick={handleChangeTheme}>Toggle Theme</Button>
            {theme}
            <br />
            <br />
            <UserProfile userData={userData} />
            <AlcCard />
        </main>
    );
}
