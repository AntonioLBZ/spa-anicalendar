import type { ContentFilter, SeasonalFiltersState } from '@/contexts';
import type { MediaFormat } from '@/services';

const FORMAT_OPTIONS: MediaFormat[] = ['TV', 'TV_SHORT', 'MOVIE', 'SPECIAL', 'OVA', 'ONA', 'MUSIC'];

const TOP_N_OPTIONS: number[] = [10, 25, 50];

const USER_LIST_OPTIONS: Array<{ key: keyof SeasonalFiltersState['userList']; name: string }> = [
    { key: 'watching', name: 'userListWatching' },
    { key: 'planning', name: 'userListPlanning' },
];

const CONTENT_FILTER_OPTIONS: ContentFilter[] = ['sfw', 'plus16', 'plus18'];

export { FORMAT_OPTIONS, TOP_N_OPTIONS, USER_LIST_OPTIONS, CONTENT_FILTER_OPTIONS };
