'use client';

import { useSyncExternalStore, useLayoutEffect, useMemo, useCallback, type ReactNode } from 'react';

import { createContext } from '@/lib/context';
import { createPersistedStore } from '@/lib/create-persisted-store';

import { useResolvedTheme } from '../../lib/use-theme';

import type {
    ContentFilter,
    EmptyDaysMode,
    ThemeMode,
    WeekStartDay,
    TimeFormat,
    CalendarLayout,
    SettingsContextValue,
} from './settings-context.types';
import type { Provider } from '@/services/api/api.types';

const STORAGE_KEY = 'anicalendar-settings';

type SettingsState = {
    provider: Provider;
    theme: ThemeMode;
    contentFilter: ContentFilter;
    emptyDaysMode: EmptyDaysMode;
    weekStartDay: WeekStartDay;
    timeFormat: TimeFormat;
    calendarLayout: CalendarLayout;
};

const DEFAULTS: SettingsState = {
    provider: 'anilist',
    theme: 'system',
    contentFilter: 'sfw',
    emptyDaysMode: 'show',
    weekStartDay: 'monday',
    timeFormat: '24h',
    calendarLayout: 'auto',
};

const settingsStore = createPersistedStore<SettingsState>(STORAGE_KEY, DEFAULTS, (defaults, saved) => ({
    ...defaults,
    ...saved,
}));

const [SettingsContext, useSettingsContext] = createContext<SettingsContextValue>();

const SettingsProvider = (props: { children: ReactNode }) => {
    const { children } = props;
    const settings = useSyncExternalStore(
        settingsStore.subscribe,
        settingsStore.getSnapshot,
        settingsStore.getServerSnapshot
    );

    const resolvedTheme = useResolvedTheme();

    useLayoutEffect(() => {
        settingsStore.hydrate();
    }, []);

    const setProvider = useCallback((v: Provider) => settingsStore.set((s) => ({ ...s, provider: v })), []);
    const setTheme = useCallback((v: ThemeMode) => settingsStore.set((s) => ({ ...s, theme: v })), []);
    const setContentFilter = useCallback(
        (v: ContentFilter) => settingsStore.set((s) => ({ ...s, contentFilter: v })),
        []
    );
    const setEmptyDaysMode = useCallback(
        (v: EmptyDaysMode) => settingsStore.set((s) => ({ ...s, emptyDaysMode: v })),
        []
    );
    const setWeekStartDay = useCallback((v: WeekStartDay) => settingsStore.set((s) => ({ ...s, weekStartDay: v })), []);
    const setTimeFormat = useCallback((v: TimeFormat) => settingsStore.set((s) => ({ ...s, timeFormat: v })), []);
    const setCalendarLayout = useCallback(
        (v: CalendarLayout) => settingsStore.set((s) => ({ ...s, calendarLayout: v })),
        []
    );

    const value = useMemo<SettingsContextValue>(
        () => ({
            provider: settings.provider,
            setProvider,
            theme: settings.theme,
            resolvedTheme: resolvedTheme(settings.theme),
            setTheme,
            contentFilter: settings.contentFilter,
            setContentFilter,
            emptyDaysMode: settings.emptyDaysMode,
            setEmptyDaysMode,
            weekStartDay: settings.weekStartDay,
            setWeekStartDay,
            timeFormat: settings.timeFormat,
            setTimeFormat,
            calendarLayout: settings.calendarLayout,
            setCalendarLayout,
        }),
        [
            settings,
            setProvider,
            setTheme,
            setContentFilter,
            resolvedTheme,
            setEmptyDaysMode,
            setWeekStartDay,
            setTimeFormat,
            setCalendarLayout,
        ]
    );

    return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export { SettingsProvider, useSettingsContext };
