import { useEffect, useMemo } from 'react';

import { useSettingsContext } from '@/contexts/settings-context';
import { useUserContext } from '@/contexts/user-context';
import { getEntriesWithNextAiring } from '@/lib/airing';
import { useRouter } from '@/lib/i18n/navigation';
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

    const mediaListQuery = useMediaList(provider, userQuery.data);

    const queryError = userQuery.error ?? mediaListQuery.error ?? null;

    useEffect(() => {
        if (queryError) {
            router.push(`/?error=UserNotFound`);
        }
    }, [queryError, router]);

    const entries = useMemo(() => getEntriesWithNextAiring(mediaListQuery.data ?? []), [mediaListQuery.data]);

    return {
        entries,
        error: queryError?.message ?? null,
        isLoading: userQuery.isLoading || mediaListQuery.isLoading,
    };
};

export { useAiringData };
