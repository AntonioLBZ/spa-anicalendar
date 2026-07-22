'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { Button, ErrorState, Link } from '@/components';
import { useSettingsContext } from '@/contexts/settings-context';
import { CalendarToolbar } from '@/features/calendar-toolbar';
import { filterByContent, filterByHidden, WeeklyCalendar } from '@/features/weekly-calendar';
import { getCalendarStats } from '@/lib/airing';
import { Link as NavLink } from '@/lib/i18n/navigation';

import { useEntryVisibility } from '../use-entry-visibility';
import { useAiringData } from './use-airing-data';

import '../page.css';

export default function AiringPage() {
    const t = useTranslations('airing');
    const params = useParams<{ user: string }>();
    const rawUser = Array.isArray(params.user) ? params.user[0] : params.user;
    const userName = rawUser ? decodeURIComponent(rawUser) : null;

    const { entries, error, retry } = useAiringData(userName);
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
                <CalendarToolbar
                    stats={stats}
                    isEditMode={isEditMode}
                    hiddenCount={hiddenCount}
                    onEnter={enterEditMode}
                    onSave={saveEditMode}
                    onCancel={cancelEditMode}
                    isAllHidden={isAllHidden}
                    onToggleAll={handleToggleAll}
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
