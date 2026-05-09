'use client';

import { DialogTrigger, Popover, Dialog, RadioGroup, Radio } from 'react-aria-components';

import { Settings as S } from '@/components';
import { useSettingsContext } from '@/contexts/settings-context';

import type { ContentFilter, EmptyDaysMode, ThemeMode, WeekStartDay, TimeFormat } from '@/contexts/settings-context';

const GearIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
        />
    </svg>
);

const CONTENT_FILTER_OPTIONS: { value: ContentFilter; label: string }[] = [
    { value: 'sfw', label: 'SFW' },
    { value: 'plus16', label: '+16' },
    { value: 'plus18', label: '+18' },
];

const EMPTY_DAYS_OPTIONS: { value: EmptyDaysMode; label: string }[] = [
    { value: 'show', label: 'Show' },
    { value: 'minimize', label: 'Min' },
    { value: 'hide', label: 'Hide' },
];

const WEEK_START_OPTIONS: { value: WeekStartDay; label: string }[] = [
    { value: 'monday', label: 'Mon' },
    { value: 'sunday', label: 'Sun' },
];

const TIME_FORMAT_OPTIONS: { value: TimeFormat; label: string }[] = [
    { value: '24h', label: '24h' },
    { value: '12h', label: '12h' },
];

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
            <S.Trigger aria-label="Settings">
                <GearIcon />
            </S.Trigger>
            <Popover placement="bottom end" className="settings__panel">
                <Dialog className="settings__dialog">
                    <S.Section>
                        <S.SectionTitle>Theme</S.SectionTitle>
                        <RadioGroup
                            aria-label="Theme"
                            value={theme}
                            onChange={(v) => setTheme(v as ThemeMode)}
                        >
                            <S.OptionGroup>
                                <Radio value="system">
                                    {({ isSelected }) => (
                                        <S.Option isSelected={isSelected}>System</S.Option>
                                    )}
                                </Radio>
                                <Radio value="dark">
                                    {({ isSelected }) => (
                                        <S.Option isSelected={isSelected}>Dark</S.Option>
                                    )}
                                </Radio>
                                <Radio value="light">
                                    {({ isSelected }) => (
                                        <S.Option isSelected={isSelected}>Light</S.Option>
                                    )}
                                </Radio>
                            </S.OptionGroup>
                        </RadioGroup>
                    </S.Section>
                    <S.Section>
                        <S.SectionTitle>Content</S.SectionTitle>
                        <RadioGroup
                            aria-label="Content"
                            value={contentFilter}
                            onChange={(v) => setContentFilter(v as ContentFilter)}
                        >
                            <S.OptionGroup>
                                {CONTENT_FILTER_OPTIONS.map(({ value, label }) => (
                                    <Radio key={value} value={value}>
                                        {({ isSelected }) => (
                                            <S.Option isSelected={isSelected}>{label}</S.Option>
                                        )}
                                    </Radio>
                                ))}
                            </S.OptionGroup>
                        </RadioGroup>
                    </S.Section>
                    <S.Section>
                        <S.SectionTitle>Empty Days</S.SectionTitle>
                        <RadioGroup
                            aria-label="Empty Days"
                            value={emptyDaysMode}
                            onChange={(v) => setEmptyDaysMode(v as EmptyDaysMode)}
                        >
                            <S.OptionGroup>
                                {EMPTY_DAYS_OPTIONS.map(({ value, label }) => (
                                    <Radio key={value} value={value}>
                                        {({ isSelected }) => (
                                            <S.Option isSelected={isSelected}>{label}</S.Option>
                                        )}
                                    </Radio>
                                ))}
                            </S.OptionGroup>
                        </RadioGroup>
                    </S.Section>
                    <S.Section>
                        <S.SectionTitle>Week Start</S.SectionTitle>
                        <RadioGroup
                            aria-label="Week Start"
                            value={weekStartDay}
                            onChange={(v) => setWeekStartDay(v as WeekStartDay)}
                        >
                            <S.OptionGroup>
                                {WEEK_START_OPTIONS.map(({ value, label }) => (
                                    <Radio key={value} value={value}>
                                        {({ isSelected }) => (
                                            <S.Option isSelected={isSelected}>{label}</S.Option>
                                        )}
                                    </Radio>
                                ))}
                            </S.OptionGroup>
                        </RadioGroup>
                    </S.Section>
                    <S.Section>
                        <S.SectionTitle>Time Format</S.SectionTitle>
                        <RadioGroup
                            aria-label="Time Format"
                            value={timeFormat}
                            onChange={(v) => setTimeFormat(v as TimeFormat)}
                        >
                            <S.OptionGroup>
                                {TIME_FORMAT_OPTIONS.map(({ value, label }) => (
                                    <Radio key={value} value={value}>
                                        {({ isSelected }) => (
                                            <S.Option isSelected={isSelected}>{label}</S.Option>
                                        )}
                                    </Radio>
                                ))}
                            </S.OptionGroup>
                        </RadioGroup>
                    </S.Section>
                </Dialog>
            </Popover>
        </DialogTrigger>
    );
};

export { Settings };
