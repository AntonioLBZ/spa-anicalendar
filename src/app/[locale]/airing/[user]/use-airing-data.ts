import { notFound } from 'next/navigation';
import { useEffect, useMemo } from 'react';

import { useSeasonalFilters } from '@/contexts';
import { useUserContext } from '@/contexts/user-context';
import { useRouter } from '@/lib/i18n/navigation';
import { isUserNotFoundError, useMediaList, useUser } from '@/services';

import { buildRequestedStatuses, filterAiringEntries } from './use-airing-data.filters';

import type { Provider } from '@/services/api/api.types';

const useAiringData = (userName: string | null, provider: Provider) => {
    const router = useRouter();
    const { setUser } = useUserContext();
    const { filters } = useSeasonalFilters();

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

    // Clear the header's user on unmount
    useEffect(() => {
        return () => setUser?.(undefined);
    }, [setUser]);

    const requestedStatuses = useMemo(() => buildRequestedStatuses(filters.userList), [filters.userList]);

    const mediaListQuery = useMediaList(provider, userQuery.data, requestedStatuses, {
        formats: filters.formats,
        onlyNewSeason: filters.onlyNewSeason,
    });

    const queryError = userQuery.error ?? mediaListQuery.error ?? null;

    if (queryError && isUserNotFoundError(queryError)) {
        notFound();
    }

    const entries = useMemo(
        () => filterAiringEntries(mediaListQuery.data ?? [], { formats: filters.formats, onlyNewSeason: filters.onlyNewSeason }),
        [mediaListQuery.data, filters.onlyNewSeason, filters.formats],
    );

    const retry = () => {
        if (userQuery.error) {
            userQuery.refetch();
        } else if (mediaListQuery.error) {
            mediaListQuery.refetch();
        }
    };

    return {
        state: {
            error: queryError,
            isLoading: userQuery.isLoading || mediaListQuery.isLoading,
        },
        data: {
            entries,
        },
        actions: {
            retry,
        },
    };
};

export { useAiringData };
export { buildRequestedStatuses, filterAiringEntries } from './use-airing-data.filters';
