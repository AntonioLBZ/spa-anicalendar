import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useSettingsContext } from '@/contexts/settings-context';
import { useUserContext } from '@/contexts/user-context';
import { analytics } from '@/lib/analytics';
import { useMediaList, useUser } from '@/services';

const useAiringData = (userName: string | null) => {
    const router = useRouter();
    const { provider } = useSettingsContext();
    const { setUser } = useUserContext();

    useEffect(() => {
        if (!userName?.trim()) {
            router.push('/');
        }
    }, [userName, router]);

    const userQuery = useUser(provider, userName);

    useEffect(() => {
        if (userQuery.data) {
            setUser?.(userQuery.data);
        }
    }, [userQuery.data, setUser]);

    const mediaListQuery = useMediaList(provider, userQuery.data?.id);

    useEffect(() => {
        if (mediaListQuery.data) {
            analytics.airingLoaded(provider, mediaListQuery.data.length);
        }
    }, [mediaListQuery.data, provider]);

    const queryError = userQuery.error ?? mediaListQuery.error ?? null;

    useEffect(() => {
        if (queryError) {
            analytics.airingError(provider);
        }
    }, [queryError, provider]);

    return {
        entries: mediaListQuery.data ?? [],
        error: queryError?.message ?? null,
        isLoading: userQuery.isLoading || mediaListQuery.isLoading,
    };
};

export { useAiringData };
