import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { SettingsProvider } from '@/contexts';
import { IntlTestWrapper } from '@/lib/test/intl-wrapper';
import { MemoryStorage } from '@/lib/test/memory-storage';

import { WeeklyCalendar } from '../weekly-calendar';

import type { AnimeEntry } from '@/services';
import type { ReactNode } from 'react';

// Entries encode their day index in `airingAt`, and "today" is pinned to Thursday (index 3 with a Monday start).
vi.mock('@/lib/airing', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@/lib/airing')>();
    return {
        ...actual,
        getAiringDay: (airingAt: number) => airingAt,
        getTodayIndex: () => 3,
    };
});

const memoryStorage = new MemoryStorage();
const scrollIntoView = vi.fn();

const Wrapper = (props: { children: ReactNode }) => (
    <IntlTestWrapper>
        <SettingsProvider>{props.children}</SettingsProvider>
    </IntlTestWrapper>
);

const makeEntry = (id: number, dayIndex: number): AnimeEntry => ({
    id,
    mediaId: id,
    title: `Anime ${id}`,
    coverImageUrl: 'https://example.com/cover.jpg',
    status: 'RELEASING',
    siteUrl: 'https://example.com/anime',
    endDate: {},
    isAdult: false,
    genres: [],
    nextAiringEpisode: { airingAt: dayIndex, episode: 2 },
});

const setLayout = (calendarLayout: 'grid' | 'list') =>
    memoryStorage.setItem(
        'anicalendar-settings',
        JSON.stringify({ calendarLayout, emptyDaysMode: 'show', weekStartDay: 'monday', theme: 'system' })
    );

beforeEach(() => {
    vi.stubGlobal('localStorage', memoryStorage);
    memoryStorage.clear();
    scrollIntoView.mockClear();
    Element.prototype.scrollIntoView = scrollIntoView;
});

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('WeeklyCalendar scroll to today', () => {
    it('scrolls today’s row into view once the list layout has data', async () => {
        setLayout('list');
        const entries = [makeEntry(1, 0), makeEntry(2, 3)];

        const { rerender } = render(<WeeklyCalendar entries={[]} isLoading />, { wrapper: Wrapper });
        expect(scrollIntoView).not.toHaveBeenCalled();

        rerender(<WeeklyCalendar entries={entries} />);

        await waitFor(() => expect(scrollIntoView).toHaveBeenCalledOnce());
        const todayRow = screen.getByRole('listitem', { name: /Thursday/ });
        expect(scrollIntoView.mock.contexts[0]).toBe(todayRow);

        rerender(<WeeklyCalendar entries={[...entries, makeEntry(3, 5)]} />);
        expect(scrollIntoView).toHaveBeenCalledOnce();
    });

    it('does not scroll in the grid layout', async () => {
        setLayout('grid');

        // As in the app, settings hydrate while the schedule is still loading
        const { rerender } = render(<WeeklyCalendar entries={[]} isLoading />, { wrapper: Wrapper });
        rerender(<WeeklyCalendar entries={[makeEntry(1, 0), makeEntry(2, 3)]} />);

        const list = await screen.findByRole('list', { name: 'Weekly anime schedule' });
        expect(list).toHaveClass('weekly-calendar__grid');
        expect(scrollIntoView).not.toHaveBeenCalled();
    });
});
