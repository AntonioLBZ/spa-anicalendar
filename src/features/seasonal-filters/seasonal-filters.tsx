'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Form } from 'react-aria-components';

import { Button, Checkbox, Radio } from '@/components';

import { FORMAT_OPTIONS, TOP_N_OPTIONS } from './seasonal-filters.options';

import './seasonal-filters.css';

import type { SeasonalFiltersProps } from './seasonal-filters.types';
import type { FormEvent } from 'react';

const SeasonalFiltersForm = (props: SeasonalFiltersProps) => {
    const { value, onSubmit } = props;
    const t = useTranslations('seasonalFilters');
    const [draft, setDraft] = useState(value);

    const selectedFormats = draft.formats.length > 0 ? draft.formats : FORMAT_OPTIONS;

    const handleFormatsChange = (next: (typeof FORMAT_OPTIONS)[number][]) => {
        if (next.length === 0) return; // keep at least one format selected

        setDraft((prev) => ({ ...prev, formats: next.length === FORMAT_OPTIONS.length ? [] : next }));
    };

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        onSubmit(draft);
    };

    return (
        <Form className="seasonal-filters" onSubmit={handleSubmit}>
            <div className="seasonal-filters__group">
                <span className="seasonal-filters__label label-s">{t('formatLabel')}</span>
                <Checkbox.Group aria-label={t('formatLabel')} value={selectedFormats} onChange={handleFormatsChange}>
                    {FORMAT_OPTIONS.map((format) => (
                        <Checkbox.Option key={format} value={format}>
                            {t(`format.${format}`)}
                        </Checkbox.Option>
                    ))}
                </Checkbox.Group>
            </div>
            <div className="seasonal-filters__group">
                <span className="seasonal-filters__label label-s">{t('topLabel')}</span>
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
            </div>
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

const SeasonalFilters = (props: SeasonalFiltersProps) => (
    <SeasonalFiltersForm key={String(props.isHydrated)} {...props} />
);

export { SeasonalFilters };
