'use client';

import { useParams } from 'next/navigation';

import { AiringView } from '../airing-view';
import { useAiringData } from './use-airing-data';
import { useSyncProviderWithUrl } from './use-sync-provider-with-url';

export default function AiringPage() {
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
            showCurrentSeasonLink
            showNextSeasonLink
        />
    );
}
