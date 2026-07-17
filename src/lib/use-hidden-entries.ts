'use client';

import { useCallback, useEffect, useSyncExternalStore } from 'react';

import { hiddenEntriesStore } from './hidden-entries-store';

const useHiddenEntries = () => {
    const hiddenIds = useSyncExternalStore(
        hiddenEntriesStore.subscribe,
        hiddenEntriesStore.getSnapshot,
        hiddenEntriesStore.getServerSnapshot
    );

    useEffect(() => {
        hiddenEntriesStore.hydrate();
    }, []);

    const setHiddenIds = useCallback((ids: number[]) => hiddenEntriesStore.set(ids), []);

    return { hiddenIds, setHiddenIds };
};

export { useHiddenEntries };
