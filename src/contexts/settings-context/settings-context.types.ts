type ContentFilter = 'sfw' | 'plus16' | 'plus18';

type EmptyDaysMode = 'show' | 'minimize' | 'hide';

type WeekStartDay = 'monday' | 'sunday';

type TimeFormat = '12h' | '24h';

interface SettingsContextValue {
    contentFilter: ContentFilter;
    setContentFilter: (filter: ContentFilter) => void;
    emptyDaysMode: EmptyDaysMode;
    setEmptyDaysMode: (mode: EmptyDaysMode) => void;
    weekStartDay: WeekStartDay;
    setWeekStartDay: (day: WeekStartDay) => void;
    timeFormat: TimeFormat;
    setTimeFormat: (format: TimeFormat) => void;
}

export type {
    ContentFilter,
    EmptyDaysMode,
    WeekStartDay,
    TimeFormat,
    SettingsContextValue,
};
