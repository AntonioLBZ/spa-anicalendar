type EntryVisibilityParams = {
    /** Storage scope for hidden ids, e.g. `${provider}:${userName}`, or a fixed scope for anonymous/seasonal browsing — keeps hidden entries from leaking between users/providers. */
    scope: string;
    /** ids of every entry currently returned for this scope, regardless of content-filter settings. Used to prune hidden ids that no longer belong to the list (dropped/completed) on save, without un-hiding entries merely excluded by the content filter. */
    allIds: number[];
    /** ids of the entries currently visible under the active content filter. Used to scope hiddenCount/isAllHidden to what's actually shown. */
    editableIds: number[];
};

export type { EntryVisibilityParams };
