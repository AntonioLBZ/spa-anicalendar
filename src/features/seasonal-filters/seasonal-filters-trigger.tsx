'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Drawer, FilterIcon } from '@/components';

import { SeasonalFilters } from './seasonal-filters';
import { useSeasonalFilters } from './use-seasonal-filters';

import type { SeasonalFiltersState } from './seasonal-filters.types';

// Self-contained trigger: reads/writes the seasonal-filters store directly, so callers (e.g. the
// header) can render `<SeasonalFiltersTrigger />` with no props.
const SeasonalFiltersTrigger = () => {
    const t = useTranslations('seasonalFilters');
    const { filters, setFilters, isHydrated } = useSeasonalFilters();
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = (next: SeasonalFiltersState) => {
        setFilters(next);
        setIsOpen(false);
    };

    return (
        <Drawer isOpen={isOpen} onOpenChange={setIsOpen}>
            <Drawer.Trigger className="button button--ghost button--size-s" aria-label={t('filtersTrigger')}>
                <FilterIcon />
            </Drawer.Trigger>
            <Drawer.Panel placement="right" closeButtonLabel={t('close')}>
                <SeasonalFilters value={filters} onSubmit={handleSubmit} isHydrated={isHydrated} />
            </Drawer.Panel>
        </Drawer>
    );
};

export { SeasonalFiltersTrigger };
