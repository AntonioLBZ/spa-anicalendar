'use client';

import { useCallback, useEffect, useSyncExternalStore } from 'react';

import { seasonalFiltersStore } from './seasonal-filters-store';

import type { SeasonalFiltersState } from '@/features/seasonal-filters';

const useSeasonalFilters = () => {
    const snapshot = useSyncExternalStore(
        seasonalFiltersStore.subscribe,
        seasonalFiltersStore.getSnapshot,
        seasonalFiltersStore.getServerSnapshot
    );

    useEffect(() => {
        seasonalFiltersStore.hydrate();
    }, []);

    const setFilters = useCallback((next: SeasonalFiltersState) => seasonalFiltersStore.set(next), []);

    return { filters: snapshot.filters, setFilters, isHydrated: snapshot.isHydrated };
};

export { useSeasonalFilters };
