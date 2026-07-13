'use client';

import { useSyncExternalStore, useEffect, useMemo, useCallback, type ReactNode } from 'react';

import { createContext } from '@/lib/context';

import { useResolvedTheme } from '../../lib/use-theme';

import type {
    ContentFilter,
    EmptyDaysMode,
    ThemeMode,
    WeekStartDay,
    TimeFormat,
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
};

const DEFAULTS: SettingsState = {
    provider: 'anilist',
    theme: 'system',
    contentFilter: 'sfw',
    emptyDaysMode: 'show',
    weekStartDay: 'monday',
    timeFormat: '24h',
};

let listeners: Array<() => void> = [];
let currentSettings: SettingsState = DEFAULTS;

const settingsStore = {
    getSnapshot: () => currentSettings,
    getServerSnapshot: () => DEFAULTS,
    subscribe: (listener: () => void) => {
        listeners = [...listeners, listener];
        return () => {
            listeners = listeners.filter((l) => l !== listener);
        };
    },
    set: (updater: (prev: SettingsState) => SettingsState) => {
        currentSettings = updater(currentSettings);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentSettings));
        listeners.forEach((l) => l());
    },
    hydrate: () => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                currentSettings = { ...DEFAULTS, ...JSON.parse(saved) };
                listeners.forEach((l) => l());
            }
        } catch {}
    },
};

const [SettingsContext, useSettingsContext] = createContext<SettingsContextValue>();

const SettingsProvider = (props: { children: ReactNode }) => {
    const { children } = props;
    const settings = useSyncExternalStore(settingsStore.subscribe, settingsStore.getSnapshot, settingsStore.getServerSnapshot);

    const resolvedTheme = useResolvedTheme();

    useEffect(() => {
        settingsStore.hydrate();
    }, []);

    const setProvider = useCallback((v: Provider) => settingsStore.set((s) => ({ ...s, provider: v })), []);
    const setTheme = useCallback((v: ThemeMode) => settingsStore.set((s) => ({ ...s, theme: v })), []);
    const setContentFilter = useCallback((v: ContentFilter) => settingsStore.set((s) => ({ ...s, contentFilter: v })), []);
    const setEmptyDaysMode = useCallback((v: EmptyDaysMode) => settingsStore.set((s) => ({ ...s, emptyDaysMode: v })), []);
    const setWeekStartDay = useCallback((v: WeekStartDay) => settingsStore.set((s) => ({ ...s, weekStartDay: v })), []);
    const setTimeFormat = useCallback((v: TimeFormat) => settingsStore.set((s) => ({ ...s, timeFormat: v })), []);

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
        ]
    );

    return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export { SettingsProvider, useSettingsContext };
