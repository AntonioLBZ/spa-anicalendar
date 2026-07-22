import { createPersistedStore } from './create-persisted-store';

import type { PersistedStore } from './create-persisted-store';

const STORAGE_KEY_PREFIX = 'anicalendar-hidden-entries';

const stores = new Map<string, PersistedStore<number[]>>();

// One store per scope (e.g. `${provider}:${userName}`, or a fixed scope for anonymous browsing)
// so hidden ids never leak between users/providers or between a real list and seasonal browsing.
const getHiddenEntriesStore = (scope: string): PersistedStore<number[]> => {
    let store = stores.get(scope);
    if (!store) {
        store = createPersistedStore<number[]>(`${STORAGE_KEY_PREFIX}:${scope}`, []);
        stores.set(scope, store);
    }
    return store;
};

export { getHiddenEntriesStore };
