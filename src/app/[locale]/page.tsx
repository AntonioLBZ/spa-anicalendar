'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Suspense, useState } from 'react';

import { Button, Field, Radio } from '@/components';
import { useSettingsContext } from '@/contexts';
import { SOURCE_OPTIONS } from '@/contexts/settings-context/options';
import { useRouter } from '@/lib/i18n/navigation';

import './page.css';

export default function HomePage() {
    return (
        <Suspense fallback={null}>
            <HomeContent />
        </Suspense>
    );
}

function HomeContent() {
    const t = useTranslations('home');
    const [userName, setUserName] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();
    const { provider, setProvider } = useSettingsContext();

    const [errorMessage, setErrorMessage] = useState(() => {
        const error = searchParams.get('error');
        return error === 'UserNotFound' ? t('errorUserNotFound') : null;
    });

    const handleUserNameChange = (value: string) => {
        setUserName(value);
        if (errorMessage) setErrorMessage(null);
    };

    const navigateToAiring = () => {
        const trimmed = userName.trim();
        if (trimmed) {
            router.push(`/airing/${encodeURIComponent(trimmed)}`);
        }
    };

    return (
        <main className="home">
            <h1 className="home__title title-l">{t('title')}</h1>
            <p className="home__subtitle body-l">{t('subtitle')}</p>
            <form
                className="home__form"
                onSubmit={(e) => {
                    e.preventDefault();
                    navigateToAiring();
                }}
            >
                <div className="home__input-group">
                    <Field.Root value={userName} onChange={handleUserNameChange} isInvalid={!!errorMessage}>
                        <Field.Control>
                            <Field.Input />
                            <Field.Label>{t('usernameLabel')}</Field.Label>
                        </Field.Control>
                        <Field.Error>{errorMessage}</Field.Error>
                    </Field.Root>
                    <Button type="submit">{t('go')}</Button>
                </div>
                <Radio.Group aria-label={t('apiProviderLabel')} value={provider} onChange={setProvider}>
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
