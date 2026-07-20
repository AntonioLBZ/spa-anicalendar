'use client';

import { useTranslations } from 'next-intl';
import { Link } from 'react-aria-components';

import { Drawer, GearIcon, Radio } from '@/components';
import { useSettingsContext } from '@/contexts/settings-context';
import {
    CONTENT_FILTER_OPTIONS,
    EMPTY_DAYS_OPTIONS,
    TIME_FORMAT_OPTIONS,
    WEEK_START_OPTIONS,
    CALENDAR_LAYOUT_OPTIONS,
} from '@/contexts/settings-context/options';

import type {
    ContentFilter,
    EmptyDaysMode,
    ThemeMode,
    WeekStartDay,
    TimeFormat,
    CalendarLayout,
} from '@/contexts/settings-context';

import './settings.css';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="settings__section">
        <h3 className="settings__section-title label-m">{title}</h3>
        {children}
    </section>
);

const Settings = () => {
    const t = useTranslations('settings');
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
        calendarLayout,
        setCalendarLayout,
    } = useSettingsContext();

    return (
        <Drawer>
            <Drawer.Trigger className="settings__trigger" aria-label={t('trigger')}>
                <GearIcon />
            </Drawer.Trigger>
            <Drawer.Panel placement="right" closeButtonLabel={t('close')}>
                <Section title={t('sections.theme')}>
                    <Radio.Group
                        aria-label={t('sections.theme')}
                        value={theme}
                        onChange={(v) => setTheme(v as ThemeMode)}
                    >
                        <Radio.Option value="system">{t('theme.system')}</Radio.Option>
                        <Radio.Option value="dark">{t('theme.dark')}</Radio.Option>
                        <Radio.Option value="light">{t('theme.light')}</Radio.Option>
                    </Radio.Group>
                </Section>
                <Section title={t('sections.content')}>
                    <Radio.Group
                        aria-label={t('sections.content')}
                        value={contentFilter}
                        onChange={(v) => setContentFilter(v as ContentFilter)}
                    >
                        {CONTENT_FILTER_OPTIONS.map((value) => (
                            <Radio.Option key={value} value={value}>
                                {t(`content.${value}`)}
                            </Radio.Option>
                        ))}
                    </Radio.Group>
                </Section>
                <Section title={t('sections.layout')}>
                    <Radio.Group
                        aria-label={t('sections.layout')}
                        value={calendarLayout}
                        onChange={(v) => setCalendarLayout(v as CalendarLayout)}
                    >
                        {CALENDAR_LAYOUT_OPTIONS.map((value) => (
                            <Radio.Option key={value} value={value}>
                                {t(`layout.${value}`)}
                            </Radio.Option>
                        ))}
                    </Radio.Group>
                </Section>
                <Section title={t('sections.emptyDays')}>
                    <Radio.Group
                        aria-label={t('sections.emptyDays')}
                        value={emptyDaysMode}
                        onChange={(v) => setEmptyDaysMode(v as EmptyDaysMode)}
                    >
                        {EMPTY_DAYS_OPTIONS.map((value) => (
                            <Radio.Option key={value} value={value}>
                                {t(`emptyDays.${value}`)}
                            </Radio.Option>
                        ))}
                    </Radio.Group>
                </Section>
                <Section title={t('sections.weekStart')}>
                    <Radio.Group
                        aria-label={t('sections.weekStart')}
                        value={weekStartDay}
                        onChange={(v) => setWeekStartDay(v as WeekStartDay)}
                    >
                        {WEEK_START_OPTIONS.map((value) => (
                            <Radio.Option key={value} value={value}>
                                {t(`weekStart.${value}`)}
                            </Radio.Option>
                        ))}
                    </Radio.Group>
                </Section>
                <Section title={t('sections.timeFormat')}>
                    <Radio.Group
                        aria-label={t('sections.timeFormat')}
                        value={timeFormat}
                        onChange={(v) => setTimeFormat(v as TimeFormat)}
                    >
                        {TIME_FORMAT_OPTIONS.map((value) => (
                            <Radio.Option key={value} value={value}>
                                {t(`timeFormat.${value}`)}
                            </Radio.Option>
                        ))}
                    </Radio.Group>
                </Section>
                <Section title={t('sections.help')}>
                    <span className="issue-text body-m">
                        {t.rich('issueText', {
                            link: (chunks) => (
                                <Link
                                    className="issue-text__link"
                                    href="https://github.com/AntonioLBZ/spa-anicalendar/issues/new/choose"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {chunks}
                                </Link>
                            ),
                        })}
                    </span>
                </Section>
            </Drawer.Panel>
        </Drawer>
    );
};

export { Settings };
