import type { Provider } from '@/services/api/api.types';

type EmptyDaysMode = 'show' | 'hide';
type ThemeMode = 'system' | 'light' | 'dark';
type ResolvedThemeMode = Exclude<ThemeMode, 'system'>;
/** Color scheme setting: a named scheme, or `profile` to follow the last viewed AniList profile's color */
type AccentColor = 'profile' | 'default' | 'anilist' | 'purple' | 'pink' | 'orange' | 'red' | 'green' | 'gray';
type ResolvedAccentColor = Exclude<AccentColor, 'profile'>;
type WeekStartDay = 'monday' | 'sunday';
type TimeFormat = '12h' | '24h';
type CalendarLayout = 'auto' | 'grid' | 'list';

interface SettingsContextValue {
    provider: Provider;
    setProvider: (provider: Provider) => void;
    lastUsername: string;
    setLastUsername: (username: string) => void;
    theme: ThemeMode;
    resolvedTheme: ResolvedThemeMode;
    setTheme: (theme: ThemeMode) => void;
    accentColor: AccentColor;
    /** The scheme actually applied (`data-accent`) */
    resolvedAccentColor: ResolvedAccentColor;
    setAccentColor: (accent: AccentColor) => void;
    /** Scheme of the last viewed AniList profile, if any */
    profileAccentColor: ResolvedAccentColor | null;
    setProfileAccentColor: (accent: ResolvedAccentColor) => void;
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
    EmptyDaysMode,
    ThemeMode,
    AccentColor,
    WeekStartDay,
    TimeFormat,
    CalendarLayout,
    SettingsContextValue,
    ResolvedThemeMode,
    ResolvedAccentColor,
};
