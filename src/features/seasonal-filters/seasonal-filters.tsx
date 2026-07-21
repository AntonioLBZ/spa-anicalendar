'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Form } from 'react-aria-components';

import {
    Button,
    Checkbox,
    DismissIcon,
    Divider,
    Drawer,
    DrawerTrigger,
    FilterIcon,
    Radio,
    Section,
} from '@/components';

import { FORMAT_OPTIONS, TOP_N_OPTIONS } from './seasonal-filters.options';
import { useSeasonalFilters } from './use-seasonal-filters';

import './seasonal-filters.css';

import type { SeasonalFiltersState } from './seasonal-filters.types';
import type { FormEvent } from 'react';

type SeasonalFiltersFormProps = {
    value: SeasonalFiltersState;
    onSubmit: (next: SeasonalFiltersState) => void;
};

const SeasonalFiltersForm = (props: SeasonalFiltersFormProps) => {
    const { value, onSubmit } = props;
    const t = useTranslations('seasonalFilters');
    const [draft, setDraft] = useState(value);

    const selectedFormats = draft.formats.length > 0 ? draft.formats : FORMAT_OPTIONS;

    const handleFormatsChange = (next: (typeof FORMAT_OPTIONS)[number][]) => {
        setDraft((prev) => ({ ...prev, formats: next.length === FORMAT_OPTIONS.length ? [] : next }));
    };

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        onSubmit(draft);
    };

    return (
        <Form className="seasonal-filters" onSubmit={handleSubmit}>
            <Section.Root>
                <Section.Title>{t('formatLabel')}</Section.Title>
                <Checkbox.Group aria-label={t('formatLabel')} value={selectedFormats} onChange={handleFormatsChange}>
                    {FORMAT_OPTIONS.map((format) => (
                        <Checkbox.Option key={format} value={format}>
                            {t(`format.${format}`)}
                        </Checkbox.Option>
                    ))}
                </Checkbox.Group>
            </Section.Root>
            <Divider />
            <Section.Root>
                <Section.Title>{t('topLabel')}</Section.Title>
                <Radio.Group
                    aria-label={t('topLabel')}
                    value={String(draft.topN)}
                    onChange={(v) => setDraft((prev) => ({ ...prev, topN: Number(v) }))}
                >
                    {TOP_N_OPTIONS.map((n) => (
                        <Radio.Option key={n} value={String(n)}>
                            {n}
                        </Radio.Option>
                    ))}
                </Radio.Group>
            </Section.Root>
            <Divider />
            <Checkbox.Option
                isSelected={draft.onlyNewSeason}
                onChange={(onlyNewSeason) => setDraft((prev) => ({ ...prev, onlyNewSeason }))}
            >
                {t('onlyNewSeason')}
            </Checkbox.Option>
            <Button type="submit" variant="primary" size="s" className="seasonal-filters__submit" slot="close">
                {t('search')}
            </Button>
        </Form>
    );
};

const SeasonalFiltersTrigger = () => {
    const t = useTranslations('seasonalFilters');
    const { filters, setFilters } = useSeasonalFilters();

    return (
        <DrawerTrigger>
            <Button size="s" variant="ghost" aria-label={t('title')}>
                <FilterIcon />
            </Button>
            <Drawer.Root placement="right">
                <Drawer.Header>
                    <span>{t('title')}</span>
                    <Button size="s" variant="ghost" aria-label={t('close')} slot="close">
                        <DismissIcon />
                    </Button>
                </Drawer.Header>
                <Drawer.Body>
                    <SeasonalFiltersForm value={filters} onSubmit={setFilters} />
                </Drawer.Body>
            </Drawer.Root>
        </DrawerTrigger>
    );
};

export { SeasonalFiltersTrigger };
