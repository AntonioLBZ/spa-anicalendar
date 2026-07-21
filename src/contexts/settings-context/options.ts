import type { ContentFilter, EmptyDaysMode, TimeFormat, WeekStartDay, CalendarLayout } from '@/contexts';
import type { Provider } from '@/services';

// Labels for these are rendered via next-intl in settings.tsx (namespace `settings`),
// keyed by each value — these arrays only define the set/order of choices.
const CONTENT_FILTER_OPTIONS: ContentFilter[] = ['sfw', 'plus16', 'plus18'];

const EMPTY_DAYS_OPTIONS: EmptyDaysMode[] = ['show', 'hide'];

const CALENDAR_LAYOUT_OPTIONS: CalendarLayout[] = ['auto', 'grid', 'list'];

const WEEK_START_OPTIONS: WeekStartDay[] = ['monday', 'sunday'];

const TIME_FORMAT_OPTIONS: TimeFormat[] = ['24h', '12h'];

const ALL_SOURCE_OPTIONS: { value: Provider; label: string }[] = [
    { value: 'anilist', label: 'AniList' },
    { value: 'myanimelist', label: 'MyAnimeList' },
    { value: 'kitsu', label: 'Kitsu' },
];

// Complete list: anilist,kitsu,myanimelist
const DEFAULT_ENABLED: Provider[] = ['anilist'];
const enabledFromEnv = process.env.NEXT_PUBLIC_ENABLED_PROVIDERS?.split(',')
    .map((s) => s.trim())
    .filter(Boolean) as Provider[] | undefined;
const enabledProviders = new Set<Provider>(enabledFromEnv ?? DEFAULT_ENABLED);
const SOURCE_OPTIONS = ALL_SOURCE_OPTIONS.filter((o) => enabledProviders.has(o.value));

export {
    CONTENT_FILTER_OPTIONS,
    EMPTY_DAYS_OPTIONS,
    WEEK_START_OPTIONS,
    TIME_FORMAT_OPTIONS,
    SOURCE_OPTIONS,
    CALENDAR_LAYOUT_OPTIONS,
};
