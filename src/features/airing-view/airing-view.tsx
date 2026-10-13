import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { Button, ErrorState, Link } from '@/components';
import { useSeasonalFilters } from '@/contexts';
import { CalendarToolbar } from '@/features/calendar-toolbar';
import { useEntryVisibility } from '@/features/entry-visibility';
import { HiddenEntriesNotice } from '@/features/hidden-entries-notice';
import { filterByContent, filterByHidden, WeeklyCalendar } from '@/features/weekly-calendar';
import { getCalendarStats } from '@/lib/airing';
import { Link as NavLink } from '@/lib/i18n/navigation';

import './airing-view.css';

import type { AiringViewProps } from './airing-view.types';

const AiringView = (props: AiringViewProps) => {
    const {
        entries,
        isLoading,
        error,
        onRetry,
        filteredOutCount = 0,
        scope,
        banner,
        disclosure,
        emptyMessage,
        noAiringLabel,
        showWatchStatus = true,
        showCurrentSeasonLink,
        showNextSeasonLink,
        hideNewSeasonFilter,
    } = props;
    const t = useTranslations('airing');
    const { filters } = useSeasonalFilters();

    const allIds = useMemo(() => entries.map((entry) => entry.id), [entries]);
    const editableEntries = useMemo(
        () => filterByContent(entries, filters.contentFilter),
        [entries, filters.contentFilter]
    );
    const editableIds = useMemo(() => editableEntries.map((entry) => entry.id), [editableEntries]);

    const visibility = useEntryVisibility({ scope, allIds, editableIds });

    const stats = useMemo(() => {
        const visibleEntries = filterByHidden(editableEntries, visibility.data.hiddenIds);
        return getCalendarStats(visibleEntries);
    }, [editableEntries, visibility.data.hiddenIds]);

    if (error) {
        return (
            <main className="airing-view">
                <ErrorState.Root>
                    <ErrorState.Title>{t('errorTitle')}</ErrorState.Title>
                    <ErrorState.Subtitle>{t('errorSubtitle')}</ErrorState.Subtitle>
                    <ErrorState.Actions>
                        <Button onPress={onRetry}>{t('retry')}</Button>
                        <Link as={NavLink} variant="primary" href="/">
                            {t('backHome')}
                        </Link>
                    </ErrorState.Actions>
                </ErrorState.Root>
            </main>
        );
    }

    return (
        <main className="airing-view">
            <div className="airing-view__content">
                {banner}
                {disclosure && <p className="airing-view__disclosure body-s">{disclosure}</p>}
                <CalendarToolbar
                    stats={stats}
                    isEditMode={visibility.state.isEditMode}
                    hiddenCount={visibility.data.hiddenCount}
                    showCurrentSeasonLink={showCurrentSeasonLink}
                    showNextSeasonLink={showNextSeasonLink}
                />
                {!isLoading && !visibility.state.isEditMode && (
                    <HiddenEntriesNotice
                        scope={scope}
                        contentFilter={filters.contentFilter}
                        counts={{
                            content: entries.length - editableEntries.length,
                            manual: visibility.data.hiddenCount,
                            listFilters: filteredOutCount,
                        }}
                    />
                )}
                <WeeklyCalendar
                    entries={entries}
                    isLoading={isLoading}
                    isEditMode={visibility.state.isEditMode}
                    hiddenIds={visibility.data.hiddenIds}
                    onToggleEntry={visibility.actions.toggleDraftHidden}
                    showWatchStatus={showWatchStatus}
                    emptyMessage={emptyMessage}
                    noAiringLabel={noAiringLabel}
                    hideNewSeasonFilter={hideNewSeasonFilter}
                    visibility={{
                        isEditMode: visibility.state.isEditMode,
                        onEnter: visibility.actions.enterEditMode,
                        onSave: visibility.actions.saveEditMode,
                        onCancel: visibility.actions.cancelEditMode,
                        isAllHidden: visibility.state.isAllHidden,
                        onToggleAll: visibility.actions.toggleAll,
                    }}
                />
            </div>
        </main>
    );
};

export { AiringView };
