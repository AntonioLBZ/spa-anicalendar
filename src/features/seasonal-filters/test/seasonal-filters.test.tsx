import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { IntlTestWrapper as Wrapper } from '@/lib/test/intl-wrapper';
import { MemoryStorage } from '@/lib/test/memory-storage';

import { SeasonalFiltersTrigger } from '../seasonal-filters';

const STORAGE_KEY = 'anicalendar-seasonal-filters';
const memoryStorage = new MemoryStorage();

const getStoredFilters = () => JSON.parse(memoryStorage.getItem(STORAGE_KEY) ?? '{}');

const openDrawer = async (user: ReturnType<typeof userEvent.setup>) => {
    render(<SeasonalFiltersTrigger />, { wrapper: Wrapper });
    await user.click(screen.getByRole('button', { name: 'Seasonal filters' }));
    return within(await screen.findByRole('dialog'));
};

beforeEach(() => {
    vi.stubGlobal('localStorage', memoryStorage);
    memoryStorage.clear();
});

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('SeasonalFiltersTrigger', () => {
    it('renders every format option checked by default when nothing is stored', async () => {
        const user = userEvent.setup();
        const dialog = await openDrawer(user);

        expect(dialog.getByRole('checkbox', { name: 'TV' })).toBeChecked();
        expect(dialog.getByRole('checkbox', { name: 'Movie' })).toBeChecked();
    });

    it('does not persist to storage while editing the draft — only on explicit submit', async () => {
        const user = userEvent.setup();
        const dialog = await openDrawer(user);

        await user.click(dialog.getByRole('checkbox', { name: 'Movie' }));
        await user.click(dialog.getByRole('radio', { name: '25' }));
        await user.click(dialog.getByRole('checkbox', { name: 'New this season only' }));

        expect(memoryStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it('persists the accumulated draft to storage only when the form is submitted', async () => {
        const user = userEvent.setup();
        const dialog = await openDrawer(user);

        await user.click(dialog.getByRole('checkbox', { name: 'Movie' }));
        await user.click(dialog.getByRole('radio', { name: '25' }));
        await user.click(dialog.getByRole('checkbox', { name: 'New this season only' }));
        await user.click(dialog.getByRole('button', { name: 'Search' }));

        await waitFor(() => {
            expect(getStoredFilters()).toEqual({
                formats: ['TV', 'TV_SHORT', 'SPECIAL', 'OVA', 'ONA', 'MUSIC'],
                topN: 25,
                onlyNewSeason: true,
            });
        });
    });

    it('allows deselecting the last remaining selected format, treating it as "all formats"', async () => {
        memoryStorage.setItem(STORAGE_KEY, JSON.stringify({ formats: ['TV'], topN: 50, onlyNewSeason: false }));
        const user = userEvent.setup();
        const dialog = await openDrawer(user);

        await user.click(dialog.getByRole('checkbox', { name: 'TV' }));
        await user.click(dialog.getByRole('button', { name: 'Search' }));

        await waitFor(() => {
            expect(getStoredFilters()).toEqual({ formats: [], topN: 50, onlyNewSeason: false });
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
