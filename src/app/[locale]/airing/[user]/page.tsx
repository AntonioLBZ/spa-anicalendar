'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Button, ErrorState } from '@/components';
import { WeeklyCalendar } from '@/features/weekly-calendar';
import { Link } from '@/lib/i18n/navigation';

import { useAiringData } from './use-airing-data';

import '@/components/button/button.css';
import './page.css';

export default function AiringPage() {
    const t = useTranslations('airing');
    const params = useParams<{ user: string }>();
    const rawUser = Array.isArray(params.user) ? params.user[0] : params.user;
    const userName = rawUser ? decodeURIComponent(rawUser) : null;

    const { entries, error, retry } = useAiringData(userName);

    if (error) {
        return (
            <main className="airing-page">
                <ErrorState.Root>
                    <ErrorState.Title>{t('errorTitle')}</ErrorState.Title>
                    <ErrorState.Subtitle>{t('errorSubtitle')}</ErrorState.Subtitle>
                    <ErrorState.Actions>
                        <Button onPress={retry}>{t('retry')}</Button>
                        <Link className="airing-page__error-back button button--primary button--size-m" href="/">
                            {t('backHome')}
                        </Link>
                    </ErrorState.Actions>
                </ErrorState.Root>
            </main>
        );
    }

    return (
        <main className="airing-page">
            <div className="airing-page__content">
                <WeeklyCalendar entries={entries} />
            </div>
        </main>
    );
}
