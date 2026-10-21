type EntryVisibilityParams = {
    /** Storage scope for hidden ids, e.g. `${provider}:${userName}`, or a fixed scope for anonymous/seasonal browsing — keeps hidden entries from leaking between users/providers. */
    scope: string;
    /** ids of the entries currently visible under the active content filter. Used to scope hiddenCount/isAllHidden/toggleAll to what's actually shown; hidden ids outside it are kept as they are. */
    editableIds: number[];
};

type EntryVisibilityControlsProps = {
    isEditMode: boolean;
    onEnter: () => void;
    onSave: () => void;
    onCancel: () => void;
    /** Whether every eligible entry is currently hidden in the edit-mode draft — drives the "hide all"/"show all" toggle label. */
    isAllHidden?: boolean;
    /** Toggles all eligible entries between fully hidden and fully visible in the edit-mode draft. Omit to hide the button. */
    onToggleAll?: () => void;
};

export type { EntryVisibilityParams, EntryVisibilityControlsProps };
