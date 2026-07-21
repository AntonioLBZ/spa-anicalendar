import { createPersistedStore } from './create-persisted-store';

const STORAGE_KEY = 'anicalendar-hidden-entries';

const hiddenEntriesStore = createPersistedStore<number[]>(STORAGE_KEY, []);

export { hiddenEntriesStore };
