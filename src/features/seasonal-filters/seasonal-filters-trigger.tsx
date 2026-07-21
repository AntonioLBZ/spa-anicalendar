'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button, DismissIcon, Drawer, DrawerTrigger, FilterIcon } from '@/components';

import { SeasonalFilters } from './seasonal-filters';
import { useSeasonalFilters } from './use-seasonal-filters';

import type { SeasonalFiltersState } from './seasonal-filters.types';

const SeasonalFiltersTrigger = () => {
    const t = useTranslations('seasonalFilters');
    const { filters, setFilters, isHydrated } = useSeasonalFilters();

    const handleSubmit = (next: SeasonalFiltersState) => {
        setFilters(next);
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
                    <SeasonalFilters value={filters} onSubmit={handleSubmit} isHydrated={isHydrated} />
                </Drawer.Body>
            </Drawer.Root>
        </DrawerTrigger>
    );
};

export { SeasonalFiltersTrigger };
