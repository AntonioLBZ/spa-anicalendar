import { notFound } from 'next/navigation';
import { useEffect } from 'react';

import { useSettingsContext } from '@/contexts/settings-context';
import { useUserContext } from '@/contexts/user-context';
import { useRouter } from '@/lib/i18n/navigation';
import { isUserNotFoundError, useMediaList, useUser } from '@/services';

const useAiringData = (userName: string | null) => {
    const router = useRouter();
    const { provider } = useSettingsContext();
    const { setUser } = useUserContext();

    useEffect(() => {
        if (!userName?.trim()) {
            router.replace('/');
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

    if (queryError && isUserNotFoundError(queryError)) {
        notFound();
    }

    const entries = mediaListQuery.data ?? [];

    const retry = () => {
        if (userQuery.error) {
            userQuery.refetch();
        } else if (mediaListQuery.error) {
            mediaListQuery.refetch();
        }
    };

    return {
        entries,
        error: queryError,
        isLoading: userQuery.isLoading || mediaListQuery.isLoading,
        retry,
    };
};

export { useAiringData };
