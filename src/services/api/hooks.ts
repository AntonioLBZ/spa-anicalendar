import { useQuery } from '@tanstack/react-query';

import { getProvider } from './registry';

import type { Provider } from './api.types';

const useUser = (provider: Provider, userName: string | null) => {
    const api = getProvider(provider);

    return useQuery({
        queryKey: ['user', provider, userName],
        queryFn: () => api.getUserByName(userName!),
        enabled: !!userName?.trim(),
    });
};

const useMediaList = (provider: Provider, userId: number | undefined) => {
    const api = getProvider(provider);

    return useQuery({
        queryKey: ['mediaList', provider, userId],
        queryFn: () => api.getMediaList(userId!),
        enabled: !!userId,
    });
};

export { useUser, useMediaList };
