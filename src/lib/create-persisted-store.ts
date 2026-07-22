type PersistedStore<T> = {
    getSnapshot: () => T;
    getServerSnapshot: () => T;
    subscribe: (listener: () => void) => () => void;
    set: (next: T | ((prev: T) => T)) => void;
    hydrate: () => void;
};

/**
 * A `useSyncExternalStore`-compatible module-level store persisted to `localStorage` under `key`.
 * `merge` controls how a saved value is combined with `defaults` on hydrate — defaults to
 * replacing wholesale, which is correct for array/primitive state; pass `(defaults, saved) => ({
 * ...defaults, ...saved })` for object state so new fields added later still get their default.
 */
const createPersistedStore = <T>(
    key: string,
    defaults: T,
    merge: (defaults: T, saved: T) => T = (_defaults, saved) => saved
): PersistedStore<T> => {
    let listeners: Array<() => void> = [];
    let current = defaults;

    const notify = () => listeners.forEach((listener) => listener());

    return {
        getSnapshot: () => current,
        getServerSnapshot: () => defaults,
        subscribe: (listener) => {
            listeners = [...listeners, listener];
            return () => {
                listeners = listeners.filter((l) => l !== listener);
            };
        },
        set: (next) => {
            current = typeof next === 'function' ? (next as (prev: T) => T)(current) : next;
            localStorage.setItem(key, JSON.stringify(current));
            notify();
        },
        hydrate: () => {
            try {
                const saved = localStorage.getItem(key);
                if (saved) {
                    current = merge(defaults, JSON.parse(saved));
                    notify();
                }
            } catch {}
        },
    };
};

export { createPersistedStore };
export type { PersistedStore };
