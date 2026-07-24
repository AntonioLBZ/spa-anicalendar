import type { MediaFormat } from '@/services';

type ContentFilter = 'sfw' | 'plus16' | 'plus18';

type SeasonalFiltersState = {
    /** Explicitly selected formats. Empty array means "all formats". */
    formats: MediaFormat[];
    /** Anonymous browsing only. */
    topN: number;
    onlyNewSeason: boolean;
    /** Signed-in browsing only. */
    userList: { watching: boolean; planning: boolean };
    contentFilter: ContentFilter;
};

export type { SeasonalFiltersState, ContentFilter };
