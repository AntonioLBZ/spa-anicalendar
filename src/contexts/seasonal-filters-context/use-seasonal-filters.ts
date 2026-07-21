'use client';

import { useCallback, useEffect, useSyncExternalStore } from 'react';

import type { SeasonalFiltersState } from './seasonal-filters-context.types';

const STORAGE_KEY = 'anicalendar-seasonal-filters';

const SEASONAL_FILTERS_DEFAULTS: SeasonalFiltersState = {
    formats: [],
    topN: 50,
    onlyNewSeason: false,
};

type SeasonalFiltersSnapshot = {
    filters: SeasonalFiltersState;
    isHydrated: boolean;
};

const SERVER_SNAPSHOT: SeasonalFiltersSnapshot = { filters: SEASONAL_FILTERS_DEFAULTS, isHydrated: false };

let listeners: Array<() => void> = [];
let currentSnapshot: SeasonalFiltersSnapshot = SERVER_SNAPSHOT;

const seasonalFiltersStore = {
    getSnapshot: () => currentSnapshot,
    getServerSnapshot: () => SERVER_SNAPSHOT,
    subscribe: (listener: () => void) => {
        listeners = [...listeners, listener];
        return () => {
            listeners = listeners.filter((l) => l !== listener);
        };
    },
    set: (filters: SeasonalFiltersState) => {
        currentSnapshot = { filters, isHydrated: currentSnapshot.isHydrated };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
        listeners.forEach((l) => l());
    },
    hydrate: () => {
        let filters = currentSnapshot.filters;
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) filters = { ...SEASONAL_FILTERS_DEFAULTS, ...JSON.parse(saved) };
        } catch {}
        currentSnapshot = { filters, isHydrated: true };
        listeners.forEach((l) => l());
    },
};

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
