import { getCurrentSeason } from '@/lib/airing';
import { useSeasonalMedia } from '@/services';

import { useSeasonalFilters } from './use-seasonal-filters';

const useSeasonalAiringData = () => {
    const { season, seasonYear } = getCurrentSeason();
    const { filters, setFilters, isHydrated } = useSeasonalFilters();

    const seasonalQuery = useSeasonalMedia({
        season,
        seasonYear,
        formats: filters.formats.length > 0 ? filters.formats : undefined,
        perPage: filters.topN,
        onlyNewSeason: filters.onlyNewSeason,
    });

    const entries = seasonalQuery.data ?? [];

    return {
        entries,
        error: seasonalQuery.error ?? null,
        isLoading: seasonalQuery.isLoading,
        retry: () => seasonalQuery.refetch(),
        filters,
        setFilters,
        isFiltersHydrated: isHydrated,
    };
};

export { useSeasonalAiringData };
