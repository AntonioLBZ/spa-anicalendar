'use client';

import React from 'react';
import { AlcCard } from '@/modules';
import { useUserContext } from '@/modules';
import { UserProfile } from '@/modules/user-profile/user-profile';
import { IUserData } from '@/services/api';
import { fetchUser } from '@/services/fetchUser';
import { useParams } from 'next/navigation';
import { validateParam } from '@/lib/validateParam';
import { useRouter } from 'next/navigation';

export default function Calendar() {
    const [userData, setUserData] = React.useState<IUserData | null>(null);
    const router = useRouter();
    const params = useParams();
    const { setUser } = useUserContext();
    const name = validateParam(params.user_name);

    React.useEffect(() => {
        const handleData = (data: IUserData) => {
            setUserData(data);
            setUser?.(data);
        };

        if (!name) router.push('/');
        else fetchUser(name, handleData);
    }, [name, setUser]);

    return (
        <main>
            <UserProfile userData={userData} />
            <AlcCard />
        </main>
    );
}
