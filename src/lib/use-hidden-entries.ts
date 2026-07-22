'use client';

import { useCallback, useEffect, useSyncExternalStore } from 'react';

import { getHiddenEntriesStore } from './hidden-entries-store';

const useHiddenEntries = (scope: string) => {
    const store = getHiddenEntriesStore(scope);

    const hiddenIds = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);

    useEffect(() => {
        store.hydrate();
    }, [store]);

    const setHiddenIds = useCallback((ids: number[]) => store.set(ids), [store]);

    return { hiddenIds, setHiddenIds };
};

export { useHiddenEntries };
