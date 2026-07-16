'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { Form } from 'react-aria-components';

import { Button, Field, Radio } from '@/components';
import { useSettingsContext } from '@/contexts';
import { SOURCE_OPTIONS } from '@/contexts/settings-context/options';
import { useRouter } from '@/lib/i18n/navigation';
import { getProvider, isUserNotFoundError, userQueryKey } from '@/services';

import './page.css';

export default function HomePage() {
    const t = useTranslations('home');
    const [userName, setUserName] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const queryClient = useQueryClient();
    const { provider, setProvider } = useSettingsContext();

    const validationErrors = useMemo(() => (errorMessage ? { username: errorMessage } : undefined), [errorMessage]);

    const handleUserNameChange = (value: string) => {
        setUserName(value);
        if (errorMessage) setErrorMessage(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmed = userName.trim();
        if (!trimmed || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const api = getProvider(provider);
            await queryClient.fetchQuery({
                queryKey: userQueryKey(provider, trimmed),
                queryFn: () => api.getUserByName(trimmed),
            });
            router.push(`/airing/${encodeURIComponent(trimmed)}`);
        } catch (error) {
            setErrorMessage(isUserNotFoundError(error) ? t('errorUserNotFound') : t('errorGeneric'));
            setIsSubmitting(false);
        }
    };

    return (
        <main className="home">
            <h1 className="home__title title-l">{t('title')}</h1>
            <p className="home__subtitle body-l">{t('subtitle')}</p>
            <Form className="home__form" validationErrors={validationErrors} onSubmit={handleSubmit}>
                <div className="home__input-group">
                    <Field.Root name="username" value={userName} onChange={handleUserNameChange}>
                        <Field.Control>
                            <Field.Input />
                            <Field.Label>{t('usernameLabel')}</Field.Label>
                        </Field.Control>
                        <Field.Error />
                    </Field.Root>
                    <Button type="submit" isDisabled={isSubmitting}>
                        {t('go')}
                    </Button>
                </div>
                <Radio.Group aria-label={t('apiProviderLabel')} value={provider} onChange={setProvider}>
                    {SOURCE_OPTIONS.map((option) => (
                        <Radio.Option key={option.value} value={option.value} className="home__radio-option">
                            {option.label}
                        </Radio.Option>
                    ))}
                </Radio.Group>
            </Form>
        </main>
    );
}
