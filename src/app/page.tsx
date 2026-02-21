'use client';

import { Button } from '@/components';
import { AlcCard } from '@/modules/alc-card/alc-card';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();

    const setUserName = (name: string) => {
        router.push(`/${name}`);
    };

    return (
        <main>
            <Button onClick={() => setUserName('LanZor')}>Go to LanZor's Profile</Button>
            <br />
            <br />
            <AlcCard />
        </main>
    );
}
