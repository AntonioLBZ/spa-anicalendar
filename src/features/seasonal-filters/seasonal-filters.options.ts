import type { MediaFormat } from '@/services';

// Labels for these are rendered via next-intl in seasonal-filters.tsx (namespace `seasonalFilters`),
// keyed by each value — this array only defines the set/order of choices.
const FORMAT_OPTIONS: MediaFormat[] = ['TV', 'TV_SHORT', 'MOVIE', 'SPECIAL', 'OVA', 'ONA', 'MUSIC'];

// AniList's Page query caps perPage at 50.
const TOP_N_OPTIONS: number[] = [10, 25, 50];

export { FORMAT_OPTIONS, TOP_N_OPTIONS };
