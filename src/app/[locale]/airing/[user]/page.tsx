'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Button, ErrorState } from '@/components';
import { EditModeBar } from '@/features/edit-mode-bar';
import { WeeklyCalendar } from '@/features/weekly-calendar';
import { Link } from '@/lib/i18n/navigation';

import { useAiringData } from './use-airing-data';
import { useEntryVisibility } from './use-entry-visibility';

import '@/components/button/button.css';
import './page.css';

export default function AiringPage() {
    const t = useTranslations('airing');
    const params = useParams<{ user: string }>();
    const rawUser = Array.isArray(params.user) ? params.user[0] : params.user;
    const userName = rawUser ? decodeURIComponent(rawUser) : null;

    const { entries, error, retry } = useAiringData(userName);
    const { isEditMode, hiddenIds, hiddenCount, enterEditMode, saveEditMode, cancelEditMode, toggleDraftHidden } =
        useEntryVisibility();

    if (error) {
        return (
            <main className="airing-page">
                <ErrorState.Root>
                    <ErrorState.Title>{t('errorTitle')}</ErrorState.Title>
                    <ErrorState.Subtitle>{t('errorSubtitle')}</ErrorState.Subtitle>
                    <ErrorState.Actions>
                        <Button onPress={retry}>{t('retry')}</Button>
                        <Link className="airing-page__error-back button button--primary button--size-m body-m" href="/">
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
                <EditModeBar
                    isEditMode={isEditMode}
                    hiddenCount={hiddenCount}
                    onEnter={enterEditMode}
                    onSave={saveEditMode}
                    onCancel={cancelEditMode}
                />
                <WeeklyCalendar
                    entries={entries}
                    isEditMode={isEditMode}
                    hiddenIds={hiddenIds}
                    onToggleEntry={toggleDraftHidden}
                />
            </div>
        </main>
    );
}
