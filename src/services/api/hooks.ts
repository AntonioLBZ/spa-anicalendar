import { useQuery } from '@tanstack/react-query';

import { getSeasonalMedia } from './anilist';
import { getProvider } from './registry';

import type { GetSeasonalMediaParams } from './anilist';
import type { MediaListFilters, Provider } from './api.types';
import type { MediaListEntryStatus, User } from '@/services/models';

const userQueryKey = (provider: Provider, userName: string | null) => ['user', provider, userName] as const;

const useUser = (provider: Provider, userName: string | null) => {
    const api = getProvider(provider);

    return useQuery({
        queryKey: userQueryKey(provider, userName),
        queryFn: () => api.getUserByName(userName!),
        enabled: !!userName?.trim(),
    });
};

const useMediaList = (
    provider: Provider,
    user: User | undefined,
    statuses: MediaListEntryStatus[] = ['WATCHING'],
    filters?: MediaListFilters,
) => {
    const api = getProvider(provider);
    const userName = user?.name;
    const statusKey = [...statuses].sort().join(',');
    const filterKey = `${[...(filters?.formats ?? [])].sort().join(',')}|${filters?.onlyNewSeason ?? false}`;

    return useQuery({
        queryKey: ['mediaList', provider, userName, statusKey, filterKey],
        queryFn: () => api.getMediaList(user!, statuses, filters),
        enabled: !!user,
    });
};

const useSeasonalMedia = (params: GetSeasonalMediaParams) => {
    return useQuery({
        queryKey: [
            'seasonal',
            'anilist',
            params.season,
            params.seasonYear,
            params.onlyNewSeason ?? false,
            params.formats?.join(',') ?? 'all',
            params.perPage ?? 50,
        ],
        queryFn: () => getSeasonalMedia(params),
    });
};

export { useUser, useMediaList, useSeasonalMedia, userQueryKey };
