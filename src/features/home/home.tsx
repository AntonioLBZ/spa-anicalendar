'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

import { Button } from '@/components';

import './home.css';

const Home = () => {
    const [userName, setUserName] = useState('');
    const router = useRouter();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const trimmed = userName.trim();
        if (trimmed) {
            router.push(`/airing?user=${encodeURIComponent(trimmed)}`);
        }
    };

    const homeClsx = 'home';
    const titleClsx = 'home__title title-1';
    const subtitleClsx = 'home__subtitle body-1';
    const formClsx = 'home__form';
    const inputClsx = 'home__input body-1';

    return (
        <main className={homeClsx}>
            <h1 className={titleClsx}>Anicalendar</h1>
            <p className={subtitleClsx}>Enter your AniList username to see your weekly airing schedule.</p>
            <form className={formClsx} onSubmit={handleSubmit}>
                <input
                    className={inputClsx}
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
};

export { Home };
