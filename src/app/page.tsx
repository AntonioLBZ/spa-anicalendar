'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components';

import './home.css';

export default function HomePage() {
    const [userName, setUserName] = useState('');
    const router = useRouter();

    const navigateToAiring = () => {
        const trimmed = userName.trim();
        if (trimmed) {
            router.push(`/airing?user=${encodeURIComponent(trimmed)}`);
        }
    };

    return (
        <main className="home">
            <h1 className="home__title title-l">Anicalendar</h1>
            <p className="home__subtitle body-l">Enter your AniList username to see your weekly airing schedule.</p>
            <form
                className="home__form"
                onSubmit={(e) => {
                    e.preventDefault();
                    navigateToAiring();
                }}
            >
                <input
                    className="home__input body-l"
                    type="text"
                    placeholder="AniList username"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    aria-label="AniList username"
                />
                <Button type="submit">Go</Button>
            </form>
        </main>
    );
}
