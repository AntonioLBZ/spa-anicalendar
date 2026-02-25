'use client';

import { useState, useEffect, useMemo, useCallback, type ReactNode } from 'react';

import { createContext } from '@/platform/lib/context';

import type {
    ContentFilter,
    EmptyDaysMode,
    WeekStartDay,
    TimeFormat,
    SettingsContextValue,
} from './settings-context.types';

const STORAGE_KEY = 'anicalendar-settings';

type SettingsState = {
    contentFilter: ContentFilter;
    emptyDaysMode: EmptyDaysMode;
    weekStartDay: WeekStartDay;
    timeFormat: TimeFormat;
};

const DEFAULTS: SettingsState = {
    contentFilter: 'plus18',
    emptyDaysMode: 'show',
    weekStartDay: 'monday',
    timeFormat: '24h',
};
// TODO sacar los tipos

const getInitialSettings = (): SettingsState => {
    if (typeof window === 'undefined') return DEFAULTS;
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? { ...DEFAULTS, ...JSON.parse(saved) } : DEFAULTS;
    } catch {
        return DEFAULTS;
    }
};

const [SettingsContext, useSettingsContext] = createContext<SettingsContextValue>();

const SettingsProvider = (props: { children: ReactNode }) => {
    const { children } = props;
    const [settings, setSettings] = useState(getInitialSettings);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }, [settings]);

    const setContentFilter = useCallback((v: ContentFilter) => setSettings((s) => ({ ...s, contentFilter: v })), []);
    const setEmptyDaysMode = useCallback((v: EmptyDaysMode) => setSettings((s) => ({ ...s, emptyDaysMode: v })), []);
    const setWeekStartDay = useCallback((v: WeekStartDay) => setSettings((s) => ({ ...s, weekStartDay: v })), []);
    const setTimeFormat = useCallback((v: TimeFormat) => setSettings((s) => ({ ...s, timeFormat: v })), []);

    const value = useMemo<SettingsContextValue>(
        () => ({
            contentFilter: settings.contentFilter,
            setContentFilter,
            emptyDaysMode: settings.emptyDaysMode,
            setEmptyDaysMode,
            weekStartDay: settings.weekStartDay,
            setWeekStartDay,
            timeFormat: settings.timeFormat,
            setTimeFormat,
        }),
        [settings, setContentFilter, setEmptyDaysMode, setWeekStartDay, setTimeFormat]
    );

    return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export { SettingsProvider, useSettingsContext };
