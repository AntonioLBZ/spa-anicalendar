const STORAGE_KEY = 'anicalendar-hidden-entries';

let listeners: Array<() => void> = [];
let currentHiddenIds: number[] = [];

const hiddenEntriesStore = {
    getSnapshot: () => currentHiddenIds,
    getServerSnapshot: () => currentHiddenIds,
    subscribe: (listener: () => void) => {
        listeners = [...listeners, listener];
        return () => {
            listeners = listeners.filter((l) => l !== listener);
        };
    },
    set: (ids: number[]) => {
        currentHiddenIds = ids;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentHiddenIds));
        listeners.forEach((l) => l());
    },
    hydrate: () => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                currentHiddenIds = JSON.parse(saved);
                listeners.forEach((l) => l());
            }
        } catch {}
    },
};

export { hiddenEntriesStore };
