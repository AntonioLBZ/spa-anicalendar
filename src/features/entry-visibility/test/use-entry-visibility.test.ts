import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { MemoryStorage } from '@/lib/test/memory-storage';

import { useEntryVisibility } from '../use-entry-visibility';

const SCOPE = 'anilist:visibility-test';
const STORAGE_KEY = `anicalendar-hidden-entries:${SCOPE}`;
const memoryStorage = new MemoryStorage();

const savedIds = () => JSON.parse(memoryStorage.getItem(STORAGE_KEY) ?? '[]') as number[];

beforeEach(() => {
    vi.stubGlobal('localStorage', memoryStorage);
    memoryStorage.setItem(STORAGE_KEY, JSON.stringify([1, 2, 99]));
});

afterEach(() => {
    vi.unstubAllGlobals();
    memoryStorage.clear();
});

describe('useEntryVisibility', () => {
    it('keeps hidden ids that are not on screen when saving, e.g. while the list is still loading', () => {
        const { result } = renderHook(() => useEntryVisibility({ scope: SCOPE, editableIds: [] }));

        act(() => result.current.actions.enterEditMode());
        act(() => result.current.actions.saveEditMode());

        expect(savedIds()).toEqual([1, 2, 99]);
    });

    it('saves the toggles made on the visible entries and keeps the rest', () => {
        const { result } = renderHook(() => useEntryVisibility({ scope: SCOPE, editableIds: [1, 2, 3] }));

        act(() => result.current.actions.enterEditMode());
        act(() => result.current.actions.toggleDraftHidden(1));
        act(() => result.current.actions.toggleDraftHidden(3));
        act(() => result.current.actions.saveEditMode());

        expect(savedIds().sort()).toEqual([2, 3, 99]);
    });

    it('"show all" only reveals the visible entries, not ones a filter is excluding', () => {
        const { result } = renderHook(() => useEntryVisibility({ scope: SCOPE, editableIds: [1, 2] }));

        act(() => result.current.actions.enterEditMode());
        expect(result.current.state.isAllHidden).toBe(true);

        act(() => result.current.actions.toggleAll());
        act(() => result.current.actions.saveEditMode());

        expect(savedIds()).toEqual([99]);
    });

    it('"hide all" adds the visible entries without duplicating or dropping existing ids', () => {
        const { result } = renderHook(() => useEntryVisibility({ scope: SCOPE, editableIds: [2, 3, 4] }));

        act(() => result.current.actions.enterEditMode());
        act(() => result.current.actions.toggleAll());
        act(() => result.current.actions.saveEditMode());

        expect(savedIds().sort()).toEqual([1, 2, 3, 4, 99]);
    });

    it('discards the draft on cancel', () => {
        const { result } = renderHook(() => useEntryVisibility({ scope: SCOPE, editableIds: [1, 2, 3] }));

        act(() => result.current.actions.enterEditMode());
        act(() => result.current.actions.toggleDraftHidden(3));
        act(() => result.current.actions.cancelEditMode());

        expect(savedIds()).toEqual([1, 2, 99]);
        expect(result.current.data.hiddenIds).toEqual([1, 2, 99]);
    });
});
