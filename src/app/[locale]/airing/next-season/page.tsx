'use client';

import { useTranslations } from 'next-intl';

import { AiringView } from '@/features/airing-view';

import { useSeasonalAiringData } from '../use-seasonal-airing-data';

export default function NextSeasonAiringPage() {
    const t = useTranslations('airing');
    const airing = useSeasonalAiringData('next');

    return (
        <AiringView
            entries={airing.data.entries}
            isLoading={airing.state.isLoading}
            error={airing.state.error}
            onRetry={airing.actions.retry}
            scope={airing.data.scope}
            disclosure={t('nextSeasonDisclosure', { count: airing.data.filters.topN })}
            emptyMessage={t('nextSeasonEmptyList')}
            noAiringLabel={t('noAirDateLabel')}
            showWatchStatus={false}
            showCurrentSeasonLink
            hideNewSeasonFilter
        />
    );
}
