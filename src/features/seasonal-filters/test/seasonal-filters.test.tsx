import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { IntlTestWrapper as Wrapper } from '@/lib/test/intl-wrapper';
import { MemoryStorage } from '@/lib/test/memory-storage';

import { SeasonalFiltersTrigger } from '../seasonal-filters';

import type { User } from '@/services';
import type { ComponentProps } from 'react';

const { useUserContext } = vi.hoisted(() => ({ useUserContext: vi.fn() }));

vi.mock('@/contexts/user-context', () => ({ useUserContext }));

const STORAGE_KEY = 'anicalendar-seasonal-filters';
const memoryStorage = new MemoryStorage();

const fakeUser: User = { id: 1, name: 'kanade', avatarUrl: '', siteUrl: '' };

const getStoredFilters = () => JSON.parse(memoryStorage.getItem(STORAGE_KEY) ?? '{}');

const openDrawer = async (
    user: ReturnType<typeof userEvent.setup>,
    props: ComponentProps<typeof SeasonalFiltersTrigger> = {}
) => {
    render(<SeasonalFiltersTrigger {...props} />, { wrapper: Wrapper });
    await user.click(screen.getByRole('button', { name: 'Seasonal filters' }));
    return within(await screen.findByRole('dialog'));
};

beforeEach(() => {
    vi.stubGlobal('localStorage', memoryStorage);
    memoryStorage.clear();
    useUserContext.mockReturnValue({ user: undefined });
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
                userList: { watching: true, planning: false },
                contentFilter: 'sfw',
            });
        });
    });

    it('allows deselecting the last remaining selected format, treating it as "all formats"', async () => {
        memoryStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                formats: ['TV'],
                topN: 50,
                onlyNewSeason: false,
                userList: { watching: true, planning: false },
            })
        );
        const user = userEvent.setup();
        const dialog = await openDrawer(user);

        await user.click(dialog.getByRole('checkbox', { name: 'TV' }));
        await user.click(dialog.getByRole('button', { name: 'Search' }));

        await waitFor(() => {
            expect(getStoredFilters()).toEqual({
                formats: [],
                topN: 50,
                onlyNewSeason: false,
                userList: { watching: true, planning: false },
                contentFilter: 'sfw',
            });
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

describe('SeasonalFiltersTrigger user_list section', () => {
    it('is absent when there is no user', async () => {
        useUserContext.mockReturnValue({ user: undefined });
        const user = userEvent.setup();
        const dialog = await openDrawer(user);

        expect(dialog.queryByRole('checkbox', { name: 'Watching' })).not.toBeInTheDocument();
        expect(dialog.queryByRole('checkbox', { name: 'Planning' })).not.toBeInTheDocument();
    });

    it('is present, with both checkboxes, when there is a user', async () => {
        useUserContext.mockReturnValue({ user: fakeUser });
        const user = userEvent.setup();
        const dialog = await openDrawer(user);

        expect(dialog.getByRole('checkbox', { name: 'Watching' })).toBeChecked();
        expect(dialog.getByRole('checkbox', { name: 'Planning' })).not.toBeChecked();
    });

    it('hides the topN radio group when there is a user', async () => {
        useUserContext.mockReturnValue({ user: fakeUser });
        const user = userEvent.setup();
        const dialog = await openDrawer(user);

        expect(dialog.queryByRole('radio', { name: '25' })).not.toBeInTheDocument();
    });

    it('shows the topN radio group when there is no user', async () => {
        useUserContext.mockReturnValue({ user: undefined });
        const user = userEvent.setup();
        const dialog = await openDrawer(user);

        expect(dialog.getByRole('radio', { name: '25' })).toBeInTheDocument();
    });

    it('includes userList in the persisted result when submitting with a user', async () => {
        useUserContext.mockReturnValue({ user: fakeUser });
        const user = userEvent.setup();
        const dialog = await openDrawer(user);

        await user.click(dialog.getByRole('checkbox', { name: 'Planning' }));
        await user.click(dialog.getByRole('button', { name: 'Search' }));

        await waitFor(() => {
            expect(getStoredFilters().userList).toEqual({ watching: true, planning: true });
        });
    });

    it('leaves the previously persisted userList unaffected when submitting without a user', async () => {
        memoryStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                formats: [],
                topN: 50,
                onlyNewSeason: false,
                userList: { watching: false, planning: true },
            })
        );
        useUserContext.mockReturnValue({ user: undefined });
        const user = userEvent.setup();
        const dialog = await openDrawer(user);

        await user.click(dialog.getByRole('button', { name: 'Search' }));

        await waitFor(() => {
            expect(getStoredFilters().userList).toEqual({ watching: false, planning: true });
        });
    });

    it('hydrates pre-existing localStorage without a userList key to { watching: true, planning: false }, without throwing', async () => {
        memoryStorage.setItem(STORAGE_KEY, JSON.stringify({ formats: [], topN: 50, onlyNewSeason: false }));
        useUserContext.mockReturnValue({ user: fakeUser });
        const user = userEvent.setup();
        const dialog = await openDrawer(user);

        expect(dialog.getByRole('checkbox', { name: 'Watching' })).toBeChecked();
        expect(dialog.getByRole('checkbox', { name: 'Planning' })).not.toBeChecked();
    });
});

describe('SeasonalFiltersTrigger hideNewSeasonFilter', () => {
    it('renders the "new this season only" checkbox by default', async () => {
        const user = userEvent.setup();
        const dialog = await openDrawer(user);

        expect(dialog.getByRole('checkbox', { name: 'New this season only' })).toBeInTheDocument();
    });

    it('hides the checkbox and keeps the previously persisted value on submit', async () => {
        memoryStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                formats: [],
                topN: 50,
                onlyNewSeason: true,
                userList: { watching: true, planning: false },
            })
        );
        const user = userEvent.setup();
        const dialog = await openDrawer(user, { hideNewSeasonFilter: true });

        expect(dialog.queryByRole('checkbox', { name: 'New this season only' })).not.toBeInTheDocument();

        await user.click(dialog.getByRole('button', { name: 'Search' }));

        await waitFor(() => {
            expect(getStoredFilters().onlyNewSeason).toBe(true);
        });
    });
});

describe('SeasonalFiltersTrigger topN resilience', () => {
    it.each([
        [0, 'zero (from Number(null) when no radio selected)'],
        [-5, 'negative'],
        [100, 'above AniList max (50)'],
        ['abc', 'non-numeric string'],
        [25.5, 'float'],
    ])('recovers invalid stored topN (%s) to default', async (invalidTopN, _description) => {
        memoryStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                formats: [],
                topN: invalidTopN,
                onlyNewSeason: false,
                userList: { watching: true, planning: false },
                contentFilter: 'sfw',
            })
        );
        const user = userEvent.setup();
        const dialog = await openDrawer(user);

        expect(dialog.getByRole('radio', { name: '50' })).toBeChecked();
        expect(dialog.getByRole('radio', { name: '25' })).not.toBeChecked();
        expect(dialog.getByRole('radio', { name: '10' })).not.toBeChecked();

        // Submitting the now-valid selection rewrites a clean value.
        await user.click(dialog.getByRole('button', { name: 'Search' }));

        await waitFor(() => {
            expect(getStoredFilters().topN).toBe(50);
        });
    });
});
