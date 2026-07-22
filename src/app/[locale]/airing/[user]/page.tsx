'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { Button, ErrorState, Link } from '@/components';
import { useSettingsContext } from '@/contexts/settings-context';
import { CalendarToolbar } from '@/features/calendar-toolbar';
import { useEntryVisibility } from '@/features/entry-visibility';
import { filterByContent, filterByHidden, WeeklyCalendar } from '@/features/weekly-calendar';
import { getCalendarStats } from '@/lib/airing';
import { Link as NavLink } from '@/lib/i18n/navigation';

import { useAiringData } from './use-airing-data';

import '../page.css';

export default function AiringPage() {
    const t = useTranslations('airing');
    const params = useParams<{ user: string }>();
    const rawUser = Array.isArray(params.user) ? params.user[0] : params.user;
    const userName = rawUser ? decodeURIComponent(rawUser) : null;

    const airing = useAiringData(userName);
    const { contentFilter, provider } = useSettingsContext();

    const allIds = useMemo(() => airing.data.entries.map((entry) => entry.id), [airing.data.entries]);
    const editableEntries = useMemo(
        () => filterByContent(airing.data.entries, contentFilter),
        [airing.data.entries, contentFilter]
    );
    const editableIds = useMemo(() => editableEntries.map((entry) => entry.id), [editableEntries]);

    const visibility = useEntryVisibility({
        scope: `${provider}:${userName ?? 'unknown'}`,
        allIds,
        editableIds,
    });

    const stats = useMemo(() => {
        const visibleEntries = filterByHidden(editableEntries, visibility.data.hiddenIds);
        return getCalendarStats(visibleEntries);
    }, [editableEntries, visibility.data.hiddenIds]);

    if (airing.state.error) {
        return (
            <main className="airing-page">
                <ErrorState.Root>
                    <ErrorState.Title>{t('errorTitle')}</ErrorState.Title>
                    <ErrorState.Subtitle>{t('errorSubtitle')}</ErrorState.Subtitle>
                    <ErrorState.Actions>
                        <Button onPress={airing.actions.retry}>{t('retry')}</Button>
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
                    isEditMode={visibility.state.isEditMode}
                    hiddenCount={visibility.data.hiddenCount}
                    onEnter={visibility.actions.enterEditMode}
                    onSave={visibility.actions.saveEditMode}
                    onCancel={visibility.actions.cancelEditMode}
                    isAllHidden={visibility.state.isAllHidden}
                    onToggleAll={visibility.actions.toggleAll}
                />
                <WeeklyCalendar
                    entries={airing.data.entries}
                    isEditMode={visibility.state.isEditMode}
                    hiddenIds={visibility.data.hiddenIds}
                    onToggleEntry={visibility.actions.toggleDraftHidden}
                />
            </div>
        </main>
    );
}
