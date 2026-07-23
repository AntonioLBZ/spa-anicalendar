'use client';

import { useTranslations } from 'next-intl';
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
import { useSeasonalFilters } from '@/contexts';
import { useUserContext } from '@/contexts/user-context';

import { FORMAT_OPTIONS, TOP_N_OPTIONS, USER_LIST_OPTIONS } from './seasonal-filters.options';

import './seasonal-filters.css';

import type { MediaFormat } from '@/services';
import type { FormEvent } from 'react';

const SeasonalFiltersTrigger = () => {
    const t = useTranslations('seasonalFilters');
    const { filters, setFilters } = useSeasonalFilters();
    const { user } = useUserContext();

    const selectedFormats = filters.formats.length > 0 ? filters.formats : FORMAT_OPTIONS;

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const formats = data.getAll('formats') as MediaFormat[];

        setFilters({
            formats: formats.length === FORMAT_OPTIONS.length ? [] : formats,
            topN: Number(data.get('topN')),
            onlyNewSeason: data.get('onlyNewSeason') === 'on',
            // Only the user-present branch reflects submitted userList checkboxes — without a
            // user the section isn't rendered, so the previously persisted value is carried over
            // unchanged rather than reset or omitted (setFilters replaces the whole object).
            userList: user
                ? {
                      watching: data.get('userListWatching') === 'on',
                      planning: data.get('userListPlanning') === 'on',
                  }
                : filters.userList,
        });
    };

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
                    <Form className="seasonal-filters" onSubmit={handleSubmit}>
                        <Section.Root>
                            <Section.Title>{t('formatLabel')}</Section.Title>
                            <Checkbox.Group name="formats" aria-label={t('formatLabel')} defaultValue={selectedFormats}>
                                {FORMAT_OPTIONS.map((format) => (
                                    <Checkbox.Option key={format} value={format}>
                                        {t(`format.${format}`)}
                                    </Checkbox.Option>
                                ))}
                            </Checkbox.Group>
                        </Section.Root>
                        <Divider />
                        <Section.Root>
                            {user ? (
                                <>
                                    <Section.Title>{t('userListLabel')}</Section.Title>
                                    {USER_LIST_OPTIONS.map(({ key, name }) => (
                                        <Checkbox.Option key={key} name={name} defaultSelected={filters.userList[key]}>
                                            {t(key)}
                                        </Checkbox.Option>
                                    ))}
                                </>
                            ) : (
                                <>
                                    <Section.Title>{t('topLabel')}</Section.Title>
                                    <Radio.Group
                                        name="topN"
                                        aria-label={t('topLabel')}
                                        defaultValue={String(filters.topN)}
                                    >
                                        {TOP_N_OPTIONS.map((n) => (
                                            <Radio.Option key={n} value={String(n)}>
                                                {n}
                                            </Radio.Option>
                                        ))}
                                    </Radio.Group>
                                </>
                            )}
                        </Section.Root>
                        <Divider />
                        <Section.Root>
                            <Section.Title>{t('newSeasonLabel')}</Section.Title>
                            <Checkbox.Option name="onlyNewSeason" defaultSelected={filters.onlyNewSeason}>
                                {t('onlyNewSeason')}
                            </Checkbox.Option>
                        </Section.Root>
                        <Button
                            type="submit"
                            variant="primary"
                            size="m"
                            className="seasonal-filters__submit"
                            slot="close"
                        >
                            {t('search')}
                        </Button>
                    </Form>
                </Drawer.Body>
            </Drawer.Root>
        </DrawerTrigger>
    );
};

export { SeasonalFiltersTrigger };
