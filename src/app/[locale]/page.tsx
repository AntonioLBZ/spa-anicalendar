'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { Form } from 'react-aria-components';

import { Button, Divider, Field, Link, Radio } from '@/components';
import { useSettingsContext } from '@/contexts';
import { SOURCE_OPTIONS } from '@/contexts/settings-context/options';
import { Link as NavLink, useRouter } from '@/lib/i18n/navigation';
import { getProvider, isUserNotFoundError, userQueryKey } from '@/services';

import './page.css';

export default function HomePage() {
    const t = useTranslations('home');
    const { provider, setProvider, lastUsername, setLastUsername } = useSettingsContext();
    const [userName, setUserName] = useState(lastUsername);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const queryClient = useQueryClient();

    const [prevLastUsername, setPrevLastUsername] = useState(lastUsername);
    if (lastUsername !== prevLastUsername) {
        setPrevLastUsername(lastUsername);
        setUserName((prev) => prev || lastUsername);
    }

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
            setLastUsername(trimmed);
            router.push(`/airing/${encodeURIComponent(trimmed)}`);
        } catch (error) {
            setErrorMessage(isUserNotFoundError(error) ? t('errorUserNotFound') : t('errorGeneric'));
            setIsSubmitting(false);
        }
    };

    return (
        <main className="home">
            <div className="home__intro">
                <h1 className="home__title display-m">{t('headline')}</h1>
                <p className="home__intro-text body-l">{t('intro')}</p>
            </div>
            <Form className="home__form" validationErrors={validationErrors} onSubmit={handleSubmit}>
                <Radio.Group aria-label={t('apiProviderLabel')} value={provider} onChange={setProvider}>
                    {SOURCE_OPTIONS.map((option) => (
                        <Radio.Option key={option.value} value={option.value}>
                            {option.label}
                        </Radio.Option>
                    ))}
                </Radio.Group>
                <div className="home__input-group">
                    <Field.Root name="username" value={userName} onChange={handleUserNameChange}>
                        <Field.Control>
                            <Field.Input />
                            <Field.Label>{t('usernameLabel')}</Field.Label>
                            <Field.Clear aria-label={t('clearUsername')} />
                        </Field.Control>
                        <Field.Error />
                    </Field.Root>
                    <Button type="submit" isDisabled={isSubmitting}>
                        {t('go')}
                    </Button>
                </div>
                <p className="home__privacy body-s">{t('privacy')}</p>
            </Form>
            <Divider className="home__divider" />
            <p className="home__lead body-l">{t('noUsernameLead')}</p>
            <div className="home__season-links">
                <Link as={NavLink} variant="secondary" href="/airing">
                    {t('browseSeason')}
                </Link>
                <Link as={NavLink} variant="secondary" href="/airing/next-season">
                    {t('browseNextSeason')}
                </Link>
            </div>
        </main>
    );
}
