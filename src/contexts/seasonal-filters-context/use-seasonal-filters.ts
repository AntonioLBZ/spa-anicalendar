'use client';

import { useCallback, useEffect, useSyncExternalStore } from 'react';

import { createPersistedStore } from '@/lib/create-persisted-store';

import type { SeasonalFiltersState } from './seasonal-filters-context.types';

const STORAGE_KEY = 'anicalendar-seasonal-filters';

const SEASONAL_FILTERS_DEFAULTS: SeasonalFiltersState = {
    formats: [],
    topN: 50,
    onlyNewSeason: false,
    userList: { watching: true, planning: false },
};

const seasonalFiltersStore = createPersistedStore<SeasonalFiltersState>(
    STORAGE_KEY,
    SEASONAL_FILTERS_DEFAULTS,
    (defaults, saved) => ({ ...defaults, ...saved })
);

const useSeasonalFilters = () => {
    const filters = useSyncExternalStore(
        seasonalFiltersStore.subscribe,
        seasonalFiltersStore.getSnapshot,
        seasonalFiltersStore.getServerSnapshot
    );

    useEffect(() => {
        seasonalFiltersStore.hydrate();
    }, []);

    const setFilters = useCallback((next: SeasonalFiltersState) => seasonalFiltersStore.set(next), []);

    return { filters, setFilters };
};

export { useSeasonalFilters };
