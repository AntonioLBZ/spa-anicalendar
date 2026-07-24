import type { MediaFormat } from '@/services';

type SeasonalFiltersState = {
    /** Explicitly selected formats. Empty array means "all formats". */
    formats: MediaFormat[];
    /** Anonymous browsing only. */
    topN: number;
    onlyNewSeason: boolean;
    /** Signed-in browsing only. */
    userList: { watching: boolean; planning: boolean };
};

export type { SeasonalFiltersState };
