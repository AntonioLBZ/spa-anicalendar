import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createPersistedStore } from '../create-persisted-store';
import { MemoryStorage } from './memory-storage';

const memoryStorage = new MemoryStorage();

beforeEach(() => {
    vi.stubGlobal('localStorage', memoryStorage);
});

afterEach(() => {
    vi.unstubAllGlobals();
    memoryStorage.clear();
});

describe('createPersistedStore', () => {
    it('persists every update under its key', () => {
        const store = createPersistedStore<number[]>('persisted-store-test', []);

        store.set([1, 2]);

        expect(JSON.parse(memoryStorage.getItem('persisted-store-test') ?? 'null')).toEqual([1, 2]);
    });

    it('keeps the value in memory and still notifies when storage rejects the write', () => {
        const store = createPersistedStore<number[]>('persisted-store-blocked', []);
        const listener = vi.fn();
        store.subscribe(listener);
        vi.spyOn(memoryStorage, 'setItem').mockImplementation(() => {
            throw new DOMException('blocked', 'SecurityError');
        });

        expect(() => store.set([7])).not.toThrow();

        expect(store.getSnapshot()).toEqual([7]);
        expect(listener).toHaveBeenCalledTimes(1);
    });
});
