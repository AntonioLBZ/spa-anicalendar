'use client';

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { Button, ErrorState } from '@/components';
import { useSettingsContext } from '@/contexts/settings-context';
import { CalendarToolbar } from '@/features/calendar-toolbar';
import { filterByContent, filterByHidden, WeeklyCalendar } from '@/features/weekly-calendar';
import { getCalendarStats } from '@/lib/airing';
import { Link } from '@/lib/i18n/navigation';

import { useEntryVisibility } from './use-entry-visibility';
import { useSeasonalAiringData } from './use-seasonal-airing-data';

import '@/components/button/button.css';
import './page.css';

export default function SeasonalAiringPage() {
    const t = useTranslations('airing');
    const { entries, error, retry } = useSeasonalAiringData();
    const { isEditMode, hiddenIds, hiddenCount, enterEditMode, saveEditMode, cancelEditMode, toggleDraftHidden } =
        useEntryVisibility();
    const { contentFilter } = useSettingsContext();

    const stats = useMemo(() => {
        const visibleEntries = filterByHidden(filterByContent(entries, contentFilter), hiddenIds);
        return getCalendarStats(visibleEntries);
    }, [entries, contentFilter, hiddenIds]);

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
                <p className="airing-page__disclosure body-s">{t('seasonalDisclosure')}</p>
                <CalendarToolbar
                    stats={stats}
                    isEditMode={isEditMode}
                    hiddenCount={hiddenCount}
                    onEnter={enterEditMode}
                    onSave={saveEditMode}
                    onCancel={cancelEditMode}
                    showPendingStats={false}
                />
                <WeeklyCalendar
                    entries={entries}
                    isEditMode={isEditMode}
                    hiddenIds={hiddenIds}
                    onToggleEntry={toggleDraftHidden}
                    showProgress={false}
                    emptyMessage={t('seasonalEmptyList')}
                />
            </div>
        </main>
    );
}
