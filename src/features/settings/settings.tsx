'use client';

import { useTranslations } from 'next-intl';
import { Link } from 'react-aria-components';

import { Button, DismissIcon, Divider, Drawer, DrawerTrigger, GearIcon, Radio, Section } from '@/components';
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
        <DrawerTrigger>
            <Button className="settings__trigger" aria-label={t('title')}>
                <GearIcon />
            </Button>
            <Drawer.Root placement="right" className="settings">
                <Drawer.Header>
                    <span>{t('title')}</span>
                    <Button className="settings__close" aria-label={t('close')} slot="close" size="s" variant="ghost">
                        <DismissIcon />
                    </Button>
                </Drawer.Header>
                <Drawer.Body className="settings__body">
                    <Section.Root>
                        <Section.Title>{t('sections.theme')}</Section.Title>
                        <Radio.Group
                            aria-label={t('sections.theme')}
                            value={theme}
                            onChange={(v) => setTheme(v as ThemeMode)}
                        >
                            <Radio.Option value="system">{t('theme.system')}</Radio.Option>
                            <Radio.Option value="dark">{t('theme.dark')}</Radio.Option>
                            <Radio.Option value="light">{t('theme.light')}</Radio.Option>
                        </Radio.Group>
                    </Section.Root>
                    <Divider />
                    <Section.Root>
                        <Section.Title>{t('sections.content')}</Section.Title>
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
                    </Section.Root>
                    <Divider />
                    <Section.Root>
                        <Section.Title>{t('sections.layout')}</Section.Title>
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
                    </Section.Root>
                    <Divider />
                    <Section.Root>
                        <Section.Title>{t('sections.emptyDays')}</Section.Title>
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
                    </Section.Root>
                    <Divider />
                    <Section.Root>
                        <Section.Title>{t('sections.weekStart')}</Section.Title>
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
                    </Section.Root>
                    <Divider />
                    <Section.Root>
                        <Section.Title>{t('sections.timeFormat')}</Section.Title>
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
                    </Section.Root>
                    <Divider />
                    <Section.Root>
                        <Section.Title>{t('sections.help')}</Section.Title>
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
                    </Section.Root>
                </Drawer.Body>
            </Drawer.Root>
        </DrawerTrigger>
    );
};

export { Settings };
