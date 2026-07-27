'use client';

import { useTranslations } from 'next-intl';

import { AiringView } from '@/features/airing-view';

import { useSeasonalAiringData } from './use-seasonal-airing-data';

export default function SeasonalAiringPage() {
    const t = useTranslations('airing');
    const airing = useSeasonalAiringData('current');

    return (
        <AiringView
            entries={airing.data.entries}
            error={airing.state.error}
            onRetry={airing.actions.retry}
            scope={airing.data.scope}
            disclosure={t('seasonalDisclosure', { count: airing.data.filters.topN })}
            emptyMessage={t('seasonalEmptyList')}
            noAiringLabel={t('noAirDateLabel')}
            showWatchStatus={false}
            showNextSeasonLink
        />
    );
}
