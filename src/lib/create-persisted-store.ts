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
 * Storage may be blocked or full: the value then lives in memory for the session.
 */
const createPersistedStore = <T>(
    key: string,
    defaults: T,
    merge: (defaults: T, saved: T) => T = (_defaults, saved) => saved
): PersistedStore<T> => {
    let listeners: Array<() => void> = [];
    let current = defaults;
    let hydrated = false;

    const notify = () => listeners.forEach((l) => l());

    const readSaved = () => {
        try {
            const saved = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
            if (saved) current = merge(defaults, JSON.parse(saved));
            return Boolean(saved);
        } catch {
            return false;
        }
    };

    const ensureHydrated = () => {
        if (hydrated) return;
        hydrated = true;
        readSaved();
    };

    return {
        getSnapshot: () => {
            ensureHydrated();
            return current;
        },
        getServerSnapshot: () => defaults,
        subscribe: (listener) => {
            listeners = [...listeners, listener];
            return () => {
                listeners = listeners.filter((l) => l !== listener);
            };
        },
        set: (next) => {
            ensureHydrated();
            current = typeof next === 'function' ? (next as (prev: T) => T)(current) : next;
            try {
                window.localStorage.setItem(key, JSON.stringify(current));
            } catch {}
            notify();
        },
        hydrate: () => {
            ensureHydrated();
            if (readSaved()) notify();
        },
    };
};

export { createPersistedStore };
export type { PersistedStore };
