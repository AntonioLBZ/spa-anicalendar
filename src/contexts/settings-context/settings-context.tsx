'use client';

import { useSyncExternalStore, useLayoutEffect, useMemo, useCallback, type ReactNode } from 'react';

import { createContext } from '@/lib/context';
import { createPersistedStore } from '@/lib/create-persisted-store';

import { useResolvedTheme } from '../../lib/use-theme';

import type {
    AccentColor,
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
    accentColor: AccentColor;
    emptyDaysMode: EmptyDaysMode;
    weekStartDay: WeekStartDay;
    timeFormat: TimeFormat;
    calendarLayout: CalendarLayout;
    lastUsername: string;
};

const DEFAULTS: SettingsState = {
    provider: 'anilist',
    theme: 'system',
    accentColor: 'default',
    emptyDaysMode: 'show',
    weekStartDay: 'monday',
    timeFormat: '24h',
    calendarLayout: 'auto',
    lastUsername: '',
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
    const setAccentColor = useCallback((v: AccentColor) => settingsStore.set((s) => ({ ...s, accentColor: v })), []);
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
    const setLastUsername = useCallback((v: string) => settingsStore.set((s) => ({ ...s, lastUsername: v })), []);

    const value = useMemo<SettingsContextValue>(
        () => ({
            provider: settings.provider,
            setProvider,
            theme: settings.theme,
            resolvedTheme: resolvedTheme(settings.theme),
            setTheme,
            accentColor: settings.accentColor,
            setAccentColor,
            emptyDaysMode: settings.emptyDaysMode,
            setEmptyDaysMode,
            weekStartDay: settings.weekStartDay,
            setWeekStartDay,
            timeFormat: settings.timeFormat,
            setTimeFormat,
            calendarLayout: settings.calendarLayout,
            setCalendarLayout,
            lastUsername: settings.lastUsername,
            setLastUsername,
        }),
        [
            settings,
            setProvider,
            setTheme,
            resolvedTheme,
            setAccentColor,
            setEmptyDaysMode,
            setWeekStartDay,
            setTimeFormat,
            setCalendarLayout,
            setLastUsername,
        ]
    );

    return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export { SettingsProvider, useSettingsContext };
