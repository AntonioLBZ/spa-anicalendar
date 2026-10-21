import { useState } from 'react';

import { useHiddenEntries } from '@/lib/use-hidden-entries';

import type { EntryVisibilityParams } from './entry-visibility.types';

const useEntryVisibility = (params: EntryVisibilityParams) => {
    const { scope, editableIds } = params;
    const { hiddenIds, setHiddenIds } = useHiddenEntries(scope);
    const [isEditMode, setIsEditMode] = useState(false);
    const [draftHiddenIds, setDraftHiddenIds] = useState<number[]>([]);

    const enterEditMode = () => {
        setDraftHiddenIds(hiddenIds);
        setIsEditMode(true);
    };

    const cancelEditMode = () => setIsEditMode(false);

    const saveEditMode = () => {
        setHiddenIds(draftHiddenIds);
        setIsEditMode(false);
    };

    const toggleDraftHidden = (id: number) => {
        setDraftHiddenIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };

    const currentHiddenIds = isEditMode ? draftHiddenIds : hiddenIds;
    const hiddenEditableCount = editableIds.filter((id) => currentHiddenIds.includes(id)).length;
    const isAllHidden = editableIds.length > 0 && editableIds.every((id) => currentHiddenIds.includes(id));

    // Only touches the entries on screen: ids hidden while a filter excluded them stay hidden
    const toggleAll = () =>
        setDraftHiddenIds((prev) =>
            isAllHidden
                ? prev.filter((id) => !editableIds.includes(id))
                : [...prev, ...editableIds.filter((id) => !prev.includes(id))]
        );

    return {
        state: {
            isEditMode,
            isAllHidden,
        },
        data: {
            hiddenIds: currentHiddenIds,
            hiddenCount: hiddenEditableCount,
        },
        actions: {
            enterEditMode,
            saveEditMode,
            cancelEditMode,
            toggleDraftHidden,
            toggleAll,
        },
    };
};

export { useEntryVisibility };
