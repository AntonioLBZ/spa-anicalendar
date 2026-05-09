import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useSettingsContext } from '@/contexts/settings-context';
import { useUserContext } from '@/contexts/user-context';
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

    return {
        entries: mediaListQuery.data ?? [],
        error: userQuery.error?.message ?? mediaListQuery.error?.message ?? null,
        isLoading: userQuery.isLoading || mediaListQuery.isLoading,
    };
};

export { useAiringData };
