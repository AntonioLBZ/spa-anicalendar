import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useUserContext } from '@/contexts/user-context';
import { getMediaList, getUserByName } from '@/services';

import type { GetMediaListParams } from '@/services';

const useAiringData = (userName: string | null) => {
    const router = useRouter();
    const { setUser } = useUserContext();

    useEffect(() => {
        if (!userName?.trim()) {
            router.push('/');
        }
    }, [userName, router]);

    const userQuery = useQuery({
        queryKey: ['user', userName],
        queryFn: () => getUserByName(userName!),
        enabled: !!userName?.trim(),
    });

    useEffect(() => {
        if (userQuery.data) {
            setUser?.(userQuery.data);
        }
    }, [userQuery.data, setUser]);

    const mediaListQuery = useQuery({
        queryKey: ['mediaList', userQuery.data?.id],
        queryFn: () => {
            const params: GetMediaListParams = {
                userId: userQuery.data!.id,
                type: 'ANIME',
                statusIn: ['CURRENT', 'REPEATING'],
            };
            return getMediaList(params);
        },
        enabled: !!userQuery.data?.id,
    });

    return {
        entries: mediaListQuery.data ?? [],
        error: userQuery.error?.message ?? mediaListQuery.error?.message ?? null,
        isLoading: userQuery.isLoading || mediaListQuery.isLoading,
    };
};

export { useAiringData };
