import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';

import { SeasonalFilters } from '../seasonal-filters';

import type { SeasonalFiltersState } from '../seasonal-filters.types';
import type { ReactNode } from 'react';

const messages = {
    seasonalFilters: {
        formatLabel: 'Format',
        format: {
            TV: 'TV',
            TV_SHORT: 'TV Short',
            MOVIE: 'Movie',
            SPECIAL: 'Special',
            OVA: 'OVA',
            ONA: 'ONA',
            MUSIC: 'Music',
        },
        topLabel: 'Top',
        onlyNewSeason: 'New this season only',
        search: 'Search',
    },
};

const Wrapper = (props: { children: ReactNode }) => (
    <NextIntlClientProvider locale="en" messages={messages}>
        {props.children}
    </NextIntlClientProvider>
);

const baseValue: SeasonalFiltersState = { formats: [], topN: 50, onlyNewSeason: false };
const noop = () => {};

describe('SeasonalFilters', () => {
    it('renders every format option checked by default when formats is empty', () => {
        render(<SeasonalFilters value={baseValue} onSubmit={noop} isHydrated />, { wrapper: Wrapper });

        expect(screen.getByRole('checkbox', { name: 'TV' })).toBeChecked();
        expect(screen.getByRole('checkbox', { name: 'Movie' })).toBeChecked();
    });

    it('does not call onSubmit while editing the draft — only on explicit submit', async () => {
        const onSubmit = vi.fn();
        const user = userEvent.setup();

        render(<SeasonalFilters value={baseValue} onSubmit={onSubmit} isHydrated />, { wrapper: Wrapper });

        await user.click(screen.getByRole('checkbox', { name: 'Movie' }));
        await user.click(screen.getByRole('radio', { name: '25' }));
        await user.click(screen.getByRole('checkbox', { name: 'New this season only' }));

        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('calls onSubmit with the accumulated draft only when the form is submitted', async () => {
        const onSubmit = vi.fn();
        const user = userEvent.setup();

        render(<SeasonalFilters value={baseValue} onSubmit={onSubmit} isHydrated />, { wrapper: Wrapper });

        await user.click(screen.getByRole('checkbox', { name: 'Movie' }));
        await user.click(screen.getByRole('radio', { name: '25' }));
        await user.click(screen.getByRole('checkbox', { name: 'New this season only' }));
        await user.click(screen.getByRole('button', { name: 'Search' }));

        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(onSubmit).toHaveBeenCalledWith({
            formats: ['TV', 'TV_SHORT', 'SPECIAL', 'OVA', 'ONA', 'MUSIC'],
            topN: 25,
            onlyNewSeason: true,
        });
    });

    it('does not allow deselecting the last remaining selected format', async () => {
        const onSubmit = vi.fn();
        const user = userEvent.setup();

        render(
            <SeasonalFilters value={{ formats: ['TV'], topN: 50, onlyNewSeason: false }} onSubmit={onSubmit} isHydrated />,
            { wrapper: Wrapper }
        );

        await user.click(screen.getByRole('checkbox', { name: 'TV' }));
        await user.click(screen.getByRole('button', { name: 'Search' }));

        expect(onSubmit).toHaveBeenCalledWith({ formats: ['TV'], topN: 50, onlyNewSeason: false });
    });
});
