import { useSeasonalFilters } from '@/contexts';
import { getCurrentSeason, getNextSeason } from '@/lib/airing';
import { useSeasonalMedia } from '@/services';

const useSeasonalAiringData = (which: 'current' | 'next' = 'current') => {
    const { season, seasonYear } = which === 'next' ? getNextSeason() : getCurrentSeason();
    const { filters } = useSeasonalFilters();

    const seasonalQuery = useSeasonalMedia({
        which,
        season,
        seasonYear,
        formats: filters.formats.length > 0 ? filters.formats : undefined,
        perPage: filters.topN,
        onlyNewSeason: filters.onlyNewSeason,
    });

    const entries = seasonalQuery.data ?? [];

    return {
        state: {
            error: seasonalQuery.error ?? null,
            isLoading: seasonalQuery.isLoading,
        },
        data: {
            entries,
            filters,
            scope: `seasonal:${season}:${seasonYear}`,
        },
        actions: {
            retry: () => seasonalQuery.refetch(),
        },
    };
};

export { useSeasonalAiringData };
