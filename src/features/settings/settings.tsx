'use client';

import { DialogTrigger, Popover, Dialog, Button, Link } from 'react-aria-components';

import { Radio } from '@/components';
import { useSettingsContext } from '@/contexts/settings-context';
import {
    CONTENT_FILTER_OPTIONS,
    EMPTY_DAYS_OPTIONS,
    TIME_FORMAT_OPTIONS,
    WEEK_START_OPTIONS,
} from '@/contexts/settings-context/options';

import { GearIcon } from './gear-icon';

import type { ContentFilter, EmptyDaysMode, ThemeMode, WeekStartDay, TimeFormat } from '@/contexts/settings-context';

import './settings.css';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="settings__section">
        <h3 className="settings__section-title label-m">{title}</h3>
        {children}
    </section>
);

const Settings = () => {
    const {
        theme,
        setTheme,
        contentFilter,
        setContentFilter,
        emptyDaysMode,
        setEmptyDaysMode,
        weekStartDay,
        setWeekStartDay,
        timeFormat,
        setTimeFormat,
    } = useSettingsContext();

    return (
        <DialogTrigger>
            <Button className="settings__trigger" aria-label="Settings">
                <GearIcon />
            </Button>
            <Popover placement="bottom end" className="settings__panel">
                <Dialog className="settings__dialog">
                    <Section title="Theme">
                        <Radio.Group aria-label="Theme" value={theme} onChange={(v) => setTheme(v as ThemeMode)}>
                            <Radio.Option value="system">System</Radio.Option>
                            <Radio.Option value="dark">Dark</Radio.Option>
                            <Radio.Option value="light">Light</Radio.Option>
                        </Radio.Group>
                    </Section>
                    <Section title="Content">
                        <Radio.Group
                            aria-label="Content"
                            value={contentFilter}
                            onChange={(v) => setContentFilter(v as ContentFilter)}
                        >
                            {CONTENT_FILTER_OPTIONS.map(({ value, label }) => (
                                <Radio.Option key={value} value={value}>
                                    {label}
                                </Radio.Option>
                            ))}
                        </Radio.Group>
                    </Section>
                    <Section title="Empty Days">
                        <Radio.Group
                            aria-label="Empty Days"
                            value={emptyDaysMode}
                            onChange={(v) => setEmptyDaysMode(v as EmptyDaysMode)}
                        >
                            {EMPTY_DAYS_OPTIONS.map(({ value, label }) => (
                                <Radio.Option key={value} value={value}>
                                    {label}
                                </Radio.Option>
                            ))}
                        </Radio.Group>
                    </Section>
                    <Section title="Week Start">
                        <Radio.Group
                            aria-label="Week Start"
                            value={weekStartDay}
                            onChange={(v) => setWeekStartDay(v as WeekStartDay)}
                        >
                            {WEEK_START_OPTIONS.map(({ value, label }) => (
                                <Radio.Option key={value} value={value}>
                                    {label}
                                </Radio.Option>
                            ))}
                        </Radio.Group>
                    </Section>
                    <Section title="Time Format">
                        <Radio.Group
                            aria-label="Time Format"
                            value={timeFormat}
                            onChange={(v) => setTimeFormat(v as TimeFormat)}
                        >
                            {TIME_FORMAT_OPTIONS.map(({ value, label }) => (
                                <Radio.Option key={value} value={value}>
                                    {label}
                                </Radio.Option>
                            ))}
                        </Radio.Group>
                    </Section>
                    <span className="issue-text boddy-m">
                        Any issue? Click{' '}
                        <Link
                            className="issue-text__link"
                            href="https://github.com/AntonioLBZ/spa-anicalendar/issues/new/choose"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            here
                        </Link>
                    </span>
                </Dialog>
            </Popover>
        </DialogTrigger>
    );
};

export { Settings };
