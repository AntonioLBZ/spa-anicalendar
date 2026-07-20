import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { MemoryStorage } from '@/lib/test/memory-storage';

import { SeasonalFilters } from '../seasonal-filters';
import { SeasonalFiltersTrigger } from '../seasonal-filters-trigger';

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
        filtersTrigger: 'Seasonal filters',
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

// GOTCHA: SeasonalFiltersTrigger renders its Drawer.Panel as an RAC `Modal`, which activates
// `ariaHideOutside` and hides sibling DOM (including the trigger) from the accessibility tree
// while open. Query the trigger from `screen` BEFORE opening, then scope all post-open content
// queries with `within(screen.getByRole('dialog'))`. No focus-trap tab-cycling assertions here.
describe('SeasonalFiltersTrigger', () => {
    const STORAGE_KEY = 'anicalendar-seasonal-filters';
    const memoryStorage = new MemoryStorage();

    beforeEach(() => {
        vi.stubGlobal('localStorage', memoryStorage);
        memoryStorage.clear();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('opens the drawer, renders the form inside the dialog, and submits an updated value to the store', async () => {
        const user = userEvent.setup();
        render(<SeasonalFiltersTrigger />, { wrapper: Wrapper });

        const trigger = screen.getByRole('button', { name: 'Seasonal filters' });
        await user.click(trigger);

        const dialog = await screen.findByRole('dialog');
        await user.click(within(dialog).getByRole('radio', { name: '25' }));
        await user.click(within(dialog).getByRole('button', { name: 'Search' }));

        await waitFor(() => {
            const stored = JSON.parse(memoryStorage.getItem(STORAGE_KEY) ?? '{}');
            expect(stored.topN).toBe(25);
        });
    });

    it('discards an unsubmitted draft on Escape dismiss, reverting to the last-committed value on reopen', async () => {
        const user = userEvent.setup();
        render(<SeasonalFiltersTrigger />, { wrapper: Wrapper });

        const trigger = screen.getByRole('button', { name: 'Seasonal filters' });

        // Establish a known committed baseline (topN = 50) independent of any other test's
        // writes to the shared module-level store. Submitting does not close the drawer, so
        // dismiss explicitly via Escape afterwards.
        await user.click(trigger);
        let dialog = await screen.findByRole('dialog');
        await user.click(within(dialog).getByRole('radio', { name: '50' }));
        await user.click(within(dialog).getByRole('button', { name: 'Search' }));
        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

        // Reopen, edit without submitting, then dismiss via Escape.
        await user.click(trigger);
        dialog = await screen.findByRole('dialog');
        expect(within(dialog).getByRole('radio', { name: '50' })).toBeChecked();
        await user.click(within(dialog).getByRole('radio', { name: '25' }));
        expect(within(dialog).getByRole('radio', { name: '25' })).toBeChecked();

        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

        // Reopen: the unsubmitted edit (25) must have been discarded — the committed value (50)
        // is what shows.
        await user.click(trigger);
        dialog = await screen.findByRole('dialog');
        expect(within(dialog).getByRole('radio', { name: '50' })).toBeChecked();
    });
});
