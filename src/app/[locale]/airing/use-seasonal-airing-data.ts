import { getCurrentSeason } from '@/lib/airing';
import { useSeasonalMedia } from '@/services';

const useSeasonalAiringData = () => {
    const { season, seasonYear } = getCurrentSeason();
    const seasonalQuery = useSeasonalMedia({ season, seasonYear });

    const entries = seasonalQuery.data ?? [];

    return {
        entries,
        error: seasonalQuery.error ?? null,
        isLoading: seasonalQuery.isLoading,
        retry: () => seasonalQuery.refetch(),
    };
};

export { useSeasonalAiringData };
