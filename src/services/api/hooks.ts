import { useQuery } from '@tanstack/react-query';

import { getProvider } from './registry';

import type { Provider } from './api.types';
import type { User } from '@/services/models';

const useUser = (provider: Provider, userName: string | null) => {
    const api = getProvider(provider);

    return useQuery({
        queryKey: ['user', provider, userName],
        queryFn: () => api.getUserByName(userName!),
        enabled: !!userName?.trim(),
    });
};

const useMediaList = (provider: Provider, user: User | undefined) => {
    const api = getProvider(provider);
    const userName = user?.name;

    return useQuery({
        queryKey: ['mediaList', provider, userName],
        queryFn: () => api.getMediaList(user!),
        enabled: !!user,
    });
};

export { useUser, useMediaList };
