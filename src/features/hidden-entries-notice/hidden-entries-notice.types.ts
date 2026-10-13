import type { ContentFilter } from '@/contexts/seasonal-filters-context';

type HiddenEntriesCounts = {
    /** Entries hidden by the content filter (SFW / +16). */
    content: number;
    /** Entries hidden manually in edit mode. */
    manual: number;
    /** Entries hidden by the format / "new this season only" filters (only computable for user lists). */
    listFilters: number;
};

type HiddenEntriesNoticeProps = {
    /** Dismissal storage scope; same value as the entry-visibility scope of the view. */
    scope: string;
    counts: HiddenEntriesCounts;
    /** Active content filter, named in the notice. */
    contentFilter: ContentFilter;
};

export type { HiddenEntriesCounts, HiddenEntriesNoticeProps };
