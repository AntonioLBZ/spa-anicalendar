import type { AccentColor, EmptyDaysMode, TimeFormat, WeekStartDay, CalendarLayout } from '@/contexts';
import type { Provider } from '@/services';

// Labels for these are rendered via next-intl in settings.tsx (namespace `settings`),
// keyed by each value — these arrays only define the set/order of choices.
const EMPTY_DAYS_OPTIONS: EmptyDaysMode[] = ['show', 'hide'];

// `profile` follows the viewed AniList profile; `default` is the original blue; the rest are AniList's
// profile colors (see `themes.css`).
const ACCENT_COLOR_OPTIONS: AccentColor[] = [
    'profile',
    'default',
    'anilist',
    'purple',
    'pink',
    'orange',
    'red',
    'green',
    'gray',
];

const CALENDAR_LAYOUT_OPTIONS: CalendarLayout[] = ['auto', 'grid', 'list'];

const WEEK_START_OPTIONS: WeekStartDay[] = ['monday', 'sunday'];

const TIME_FORMAT_OPTIONS: TimeFormat[] = ['24h', '12h'];

const ALL_SOURCE_OPTIONS: { value: Provider; label: string }[] = [
    { value: 'anilist', label: 'AniList' },
    { value: 'myanimelist', label: 'MyAnimeList' },
    { value: 'kitsu', label: 'Kitsu' },
];

const PROVIDER_LABELS = Object.fromEntries(ALL_SOURCE_OPTIONS.map((o) => [o.value, o.label])) as Record<
    Provider,
    string
>;

// Complete list: anilist,kitsu,myanimelist
const DEFAULT_ENABLED: Provider[] = ['anilist'];

/** Providers allowed by `NEXT_PUBLIC_ENABLED_PROVIDERS`; unknown names are ignored and an empty result falls back to the default. */
const parseEnabledProviders = (raw: string | undefined): Provider[] => {
    const requested = new Set((raw ?? '').split(',').map((s) => s.trim().toLowerCase()));
    const enabled = ALL_SOURCE_OPTIONS.map((o) => o.value).filter((value) => requested.has(value));
    return enabled.length > 0 ? enabled : DEFAULT_ENABLED;
};

const enabledProviders = new Set<Provider>(parseEnabledProviders(process.env.NEXT_PUBLIC_ENABLED_PROVIDERS));
const SOURCE_OPTIONS = ALL_SOURCE_OPTIONS.filter((o) => enabledProviders.has(o.value));
const DEFAULT_PROVIDER = SOURCE_OPTIONS[0].value;

const isProviderEnabled = (provider: unknown): provider is Provider => enabledProviders.has(provider as Provider);

export {
    ACCENT_COLOR_OPTIONS,
    EMPTY_DAYS_OPTIONS,
    WEEK_START_OPTIONS,
    TIME_FORMAT_OPTIONS,
    SOURCE_OPTIONS,
    DEFAULT_PROVIDER,
    PROVIDER_LABELS,
    CALENDAR_LAYOUT_OPTIONS,
    isProviderEnabled,
    parseEnabledProviders,
};
