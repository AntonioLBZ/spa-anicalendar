import { ContentFilter, EmptyDaysMode, TimeFormat, WeekStartDay } from '@/contexts';

import type { Provider } from '@/services';

const CONTENT_FILTER_OPTIONS: { value: ContentFilter; label: string }[] = [
    { value: 'sfw', label: 'SFW' },
    { value: 'plus16', label: '+16' },
    { value: 'plus18', label: '+18' },
];

const EMPTY_DAYS_OPTIONS: { value: EmptyDaysMode; label: string }[] = [
    { value: 'show', label: 'Show' },
    { value: 'minimize', label: 'Min' },
    { value: 'hide', label: 'Hide' },
];

const WEEK_START_OPTIONS: { value: WeekStartDay; label: string }[] = [
    { value: 'monday', label: 'Mon' },
    { value: 'sunday', label: 'Sun' },
];

const TIME_FORMAT_OPTIONS: { value: TimeFormat; label: string }[] = [
    { value: '24h', label: '24h' },
    { value: '12h', label: '12h' },
];

const ALL_SOURCE_OPTIONS: { value: Provider; label: string }[] = [
    { value: 'anilist', label: 'AniList' },
    { value: 'kitsu', label: 'Kitsu' },
    { value: 'myanimelist', label: 'MyAnimeList' },
    { value: 'mock', label: 'Mock' },
];

// Complete list: anilist,kitsu,myanimelist,mock
const DEFAULT_ENABLED: Provider[] = ['anilist'];
const enabledFromEnv = process.env.NEXT_PUBLIC_ENABLED_PROVIDERS?.split(',')
    .map((s) => s.trim())
    .filter(Boolean) as Provider[] | undefined;
const enabledProviders = new Set<Provider>(enabledFromEnv ?? DEFAULT_ENABLED);
const SOURCE_OPTIONS = ALL_SOURCE_OPTIONS.filter((o) => enabledProviders.has(o.value));

export { CONTENT_FILTER_OPTIONS, EMPTY_DAYS_OPTIONS, WEEK_START_OPTIONS, TIME_FORMAT_OPTIONS, SOURCE_OPTIONS };
