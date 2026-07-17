import type { ContentFilter } from '@/contexts/settings-context';
import type { AnimeEntry } from '@/services';

const filterByContent = (entries: AnimeEntry[], contentFilter: ContentFilter): AnimeEntry[] => {
    if (contentFilter === 'plus18') return entries;

    return entries.filter((entry) => {
        if (contentFilter === 'sfw') {
            return !entry.isAdult && !entry.genres.includes('Ecchi');
        }
        return !entry.isAdult;
    });
};

const filterByHidden = (entries: AnimeEntry[], hiddenIds: number[]): AnimeEntry[] => {
    if (hiddenIds.length === 0) return entries;

    return entries.filter((entry) => !hiddenIds.includes(entry.id));
};

export { filterByContent, filterByHidden };
