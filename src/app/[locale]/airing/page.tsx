'use client';

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { Button, ErrorState, Link } from '@/components';
import { useSettingsContext } from '@/contexts/settings-context';
import { CalendarToolbar } from '@/features/calendar-toolbar';
import { SeasonalFiltersTrigger } from '@/features/seasonal-filters';
import { filterByContent, filterByHidden, WeeklyCalendar } from '@/features/weekly-calendar';
import { getCalendarStats } from '@/lib/airing';
import { Link as NavLink } from '@/lib/i18n/navigation';

import { useEntryVisibility } from './use-entry-visibility';
import { useSeasonalAiringData } from './use-seasonal-airing-data';

import './page.css';

export default function SeasonalAiringPage() {
    const t = useTranslations('airing');
    const { entries, error, retry, filters } = useSeasonalAiringData();
    const {
        isEditMode,
        hiddenIds,
        hiddenCount,
        enterEditMode,
        saveEditMode,
        cancelEditMode,
        toggleDraftHidden,
        setDraftHiddenIds,
    } = useEntryVisibility();
    const { contentFilter } = useSettingsContext();

    const editableEntries = useMemo(() => filterByContent(entries, contentFilter), [entries, contentFilter]);
    const editableIds = useMemo(() => editableEntries.map((entry) => entry.id), [editableEntries]);
    const isAllHidden = editableIds.length > 0 && editableIds.every((id) => hiddenIds.includes(id));

    const handleToggleAll = () => setDraftHiddenIds(isAllHidden ? [] : editableIds);

    const stats = useMemo(() => {
        const visibleEntries = filterByHidden(editableEntries, hiddenIds);
        return getCalendarStats(visibleEntries);
    }, [editableEntries, hiddenIds]);

    if (error) {
        return (
            <main className="airing-page">
                <ErrorState.Root>
                    <ErrorState.Title>{t('errorTitle')}</ErrorState.Title>
                    <ErrorState.Subtitle>{t('errorSubtitle')}</ErrorState.Subtitle>
                    <ErrorState.Actions>
                        <Button onPress={retry}>{t('retry')}</Button>
                        <Link as={NavLink} variant="primary" href="/">
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
                <p className="airing-page__disclosure body-s">{t('seasonalDisclosure', { count: filters.topN })}</p>
                <CalendarToolbar
                    stats={stats}
                    isEditMode={isEditMode}
                    hiddenCount={hiddenCount}
                    onEnter={enterEditMode}
                    onSave={saveEditMode}
                    onCancel={cancelEditMode}
                    showPendingStats={false}
                    isSeasonal
                    isAllHidden={isAllHidden}
                    onToggleAll={handleToggleAll}
                />
                <WeeklyCalendar
                    entries={entries}
                    isEditMode={isEditMode}
                    hiddenIds={hiddenIds}
                    onToggleEntry={toggleDraftHidden}
                    showWatchStatus={false}
                    emptyMessage={t('seasonalEmptyList')}
                    sectionHeaderAction={<SeasonalFiltersTrigger />}
                />
            </div>
        </main>
    );
}
