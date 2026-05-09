import type { Provider } from '@/services/api/api.types';

type ContentFilter = 'sfw' | 'plus16' | 'plus18';
type EmptyDaysMode = 'show' | 'minimize' | 'hide';
type ThemeMode = 'system' | 'light' | 'dark';
type WeekStartDay = 'monday' | 'sunday';
type TimeFormat = '12h' | '24h';

interface SettingsContextValue {
    provider: Provider;
    setProvider: (provider: Provider) => void;
    theme: ThemeMode;
    setTheme: (theme: ThemeMode) => void;
    contentFilter: ContentFilter;
    setContentFilter: (filter: ContentFilter) => void;
    emptyDaysMode: EmptyDaysMode;
    setEmptyDaysMode: (mode: EmptyDaysMode) => void;
    weekStartDay: WeekStartDay;
    setWeekStartDay: (day: WeekStartDay) => void;
    timeFormat: TimeFormat;
    setTimeFormat: (format: TimeFormat) => void;
}

export type { ContentFilter, EmptyDaysMode, ThemeMode, WeekStartDay, TimeFormat, SettingsContextValue };
