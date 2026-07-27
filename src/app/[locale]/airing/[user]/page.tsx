'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { AiringView } from '@/features/airing-view';

import { useAiringData } from './use-airing-data';
import { useSyncProviderWithUrl } from './use-sync-provider-with-url';

export default function AiringPage() {
    const t = useTranslations('airing');
    const params = useParams<{ user: string }>();
    const rawUser = Array.isArray(params.user) ? params.user[0] : params.user;
    const userName = rawUser ? decodeURIComponent(rawUser) : null;

    const provider = useSyncProviderWithUrl();
    const airing = useAiringData(userName, provider);

    return (
        <AiringView
            entries={airing.data.entries}
            error={airing.state.error}
            onRetry={airing.actions.retry}
            scope={`${provider}:${userName ?? 'unknown'}`}
            noAiringLabel={t('finishedLabel')}
            showCurrentSeasonLink
            showNextSeasonLink
        />
    );
}
