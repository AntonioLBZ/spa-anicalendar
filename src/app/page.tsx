'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

import { Button, ErrorText, Field, Radio } from '@/components';
import { useSettingsContext } from '@/contexts';
import { SOURCE_OPTIONS } from '@/contexts/settings-context/options';
import { analytics } from '@/lib/analytics';

import './page.css';

export default function HomePage() {
    return (
        <Suspense fallback={null}>
            <HomeContent />
        </Suspense>
    );
}

function HomeContent() {
    const [userName, setUserName] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();
    const { provider, setProvider } = useSettingsContext();

    const error = searchParams.get('error');
    const errorMessage = error === 'UserNotFound' ? 'User not found. Please check your user is public.' : null;

    const navigateToAiring = () => {
        const trimmed = userName.trim();
        if (trimmed) {
            analytics.search(provider);
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
                <div>
                    <div className="home__input-group">
                        <Field.Root value={userName} onChange={setUserName}>
                            <Field.Input />
                            <Field.Label>AniList username</Field.Label>
                        </Field.Root>
                        <Button type="submit">Go</Button>
                    </div>
                    {errorMessage && <ErrorText className="home__error body-m">{errorMessage}</ErrorText>}
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
