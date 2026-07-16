import type { Provider } from '@/services/api/api.types';

type ContentFilter = 'sfw' | 'plus16' | 'plus18';
type EmptyDaysMode = 'show' | 'hide';
type ThemeMode = 'system' | 'light' | 'dark';
type ResolvedThemeMode = Exclude<ThemeMode, 'system'>;
type WeekStartDay = 'monday' | 'sunday';
type TimeFormat = '12h' | '24h';
type CalendarLayout = 'grid' | 'vertical';

interface SettingsContextValue {
    provider: Provider;
    setProvider: (provider: Provider) => void;
    theme: ThemeMode;
    resolvedTheme: ResolvedThemeMode;
    setTheme: (theme: ThemeMode) => void;
    contentFilter: ContentFilter;
    setContentFilter: (filter: ContentFilter) => void;
    emptyDaysMode: EmptyDaysMode;
    setEmptyDaysMode: (mode: EmptyDaysMode) => void;
    weekStartDay: WeekStartDay;
    setWeekStartDay: (day: WeekStartDay) => void;
    timeFormat: TimeFormat;
    setTimeFormat: (format: TimeFormat) => void;
    calendarLayout: CalendarLayout;
    setCalendarLayout: (layout: CalendarLayout) => void;
}

export type {
    ContentFilter,
    EmptyDaysMode,
    ThemeMode,
    WeekStartDay,
    TimeFormat,
    CalendarLayout,
    SettingsContextValue,
    ResolvedThemeMode,
};
