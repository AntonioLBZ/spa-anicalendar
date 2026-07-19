import type { MediaFormat } from '@/services';

type SeasonalFiltersState = {
    /** Explicitly selected formats. Empty array means "all formats". */
    formats: MediaFormat[];
    topN: number;
    onlyNewSeason: boolean;
};

type SeasonalFiltersProps = {
    value: SeasonalFiltersState;
    onSubmit: (next: SeasonalFiltersState) => void;
    /** Whether the persisted value has finished loading from storage. Used to re-sync the draft once, right after hydration completes. */
    isHydrated: boolean;
};

export type { SeasonalFiltersState, SeasonalFiltersProps };
