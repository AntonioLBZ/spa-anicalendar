import type { MediaFormat } from '@/services';

type SeasonalFiltersState = {
    /** Explicitly selected formats. Empty array means "all formats". */
    formats: MediaFormat[];
    topN: number;
    onlyNewSeason: boolean;
};

export type { SeasonalFiltersState };
