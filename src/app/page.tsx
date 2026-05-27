'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button, Field, Radio } from '@/components';
import { useSettingsContext } from '@/contexts';
import { SOURCE_OPTIONS } from '@/contexts/settings-context/options';

import './page.css';

export default function HomePage() {
    const [userName, setUserName] = useState('');
    const router = useRouter();

    const navigateToAiring = () => {
        const trimmed = userName.trim();
        if (trimmed) {
            router.push(`/airing?user=${encodeURIComponent(trimmed)}`);
        }
    };

    const { provider, setProvider } = useSettingsContext();

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
                <div className="home__input-group">
                    <Field.Root value={userName} onChange={setUserName}>
                        <Field.Input />
                        <Field.Label>AniList username</Field.Label>
                    </Field.Root>
                    <Button type="submit">Go</Button>
                </div>
                <Radio.Group aria-label="API Provider" value={provider} onChange={setProvider}>
                    {SOURCE_OPTIONS.map((option) => (
                        <Radio.Option key={option.value} value={option.value} className="home__radio-option">
                            {option.label}
                        </Radio.Option>
                    ))}
                </Radio.Group>
            </form>
        </main>
    );
}
