import type { MediaFormat } from '@/services';

type SeasonalFiltersState = {
    /** Explicitly selected formats. Empty array means "all formats". */
    formats: MediaFormat[];
    /** Top N most popular, with no User */
    topN: number;
    onlyNewSeason: boolean;
    /** Only rendered/applied, with user. */
    userList: { watching: boolean; planning: boolean };
};

export type { SeasonalFiltersState };
