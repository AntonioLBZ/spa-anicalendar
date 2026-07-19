import { useState } from 'react';

import { useHiddenEntries } from '@/lib/use-hidden-entries';

const useEntryVisibility = () => {
    const { hiddenIds, setHiddenIds } = useHiddenEntries();
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

    return {
        isEditMode,
        hiddenIds: isEditMode ? draftHiddenIds : hiddenIds,
        hiddenCount: draftHiddenIds.length,
        enterEditMode,
        saveEditMode,
        cancelEditMode,
        toggleDraftHidden,
        setDraftHiddenIds,
    };
};

export { useEntryVisibility };
