import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { SettingsProvider } from '@/contexts';
import { IntlTestWrapper } from '@/lib/test/intl-wrapper';
import { MemoryStorage } from '@/lib/test/memory-storage';

import { WeeklyCalendar } from '../weekly-calendar';

import type { AnimeEntry } from '@/services';
import type { ReactNode } from 'react';

const memoryStorage = new MemoryStorage();

// `getAiringDay` normally derives a day-of-week index from a real Unix
// timestamp + timezone. To keep this test deterministic and
// timezone-independent, the mock treats the `airingAt` value itself as the
// day index (0-6) — test entries encode their target day directly.
vi.mock('@/lib/airing', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@/lib/airing')>();
    return {
        ...actual,
        getAiringDay: (airingAt: number) => airingAt,
    };
});

const Wrapper = (props: { children: ReactNode }) => (
    <IntlTestWrapper>
        <SettingsProvider>{props.children}</SettingsProvider>
    </IntlTestWrapper>
);

const STORAGE_KEY = 'anicalendar-settings';

const DEFAULT_STORED_SETTINGS = {
    provider: 'anilist',
    theme: 'system',
    emptyDaysMode: 'show',
    weekStartDay: 'monday',
    timeFormat: '24h',
    calendarLayout: 'grid',
};

const setStoredSettings = (overrides: Partial<typeof DEFAULT_STORED_SETTINGS>) => {
    memoryStorage.setItem(STORAGE_KEY, JSON.stringify({ ...DEFAULT_STORED_SETTINGS, ...overrides }));
};

const makeEntry = (id: number, dayIndex: number): AnimeEntry => ({
    id,
    mediaId: id,
    title: `Anime ${id}`,
    coverImageUrl: 'https://example.com/cover.jpg',
    episodes: 12,
    status: 'RELEASING',
    siteUrl: 'https://example.com/anime',
    endDate: {},
    isAdult: false,
    genres: [],
    progress: 1,
    repeat: 0,
    nextAiringEpisode: { airingAt: dayIndex, episode: 2 },
});

beforeEach(() => {
    vi.stubGlobal('localStorage', memoryStorage);
    memoryStorage.clear();
});

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('WeeklyCalendar layout', () => {
    it('renders grid mode: container has weekly-calendar__grid, a --columns var, and days without day--row', async () => {
        setStoredSettings({ calendarLayout: 'grid' });
        const entries = [makeEntry(1, 0), makeEntry(2, 1), makeEntry(3, 2)];

        render(<WeeklyCalendar entries={entries} />, { wrapper: Wrapper });

        const list = await screen.findByRole('list', { name: 'Weekly anime schedule' });

        await waitFor(() => {
            expect(list).toHaveClass('weekly-calendar__grid');
            expect(list).not.toHaveClass('weekly-calendar__list');
        });
        // The `--columns` CSS var is set on the outer `.weekly-calendar`
        // wrapper (grid template consumer), not on the `role="list"` element.
        const outer = list.closest('.weekly-calendar');
        expect(outer).not.toBeNull();
        expect((outer as HTMLElement).style.getPropertyValue('--columns')).not.toBe('');

        const days = screen.getAllByRole('listitem');
        expect(days).toHaveLength(7);
        days.forEach((day) => {
            expect(day).not.toHaveClass('day--row');
        });
    });

    it('renders list mode: container has weekly-calendar__list, no --columns var, and every day carries day--row', async () => {
        setStoredSettings({ calendarLayout: 'list' });
        const entries = [makeEntry(1, 0), makeEntry(2, 1), makeEntry(3, 2)];

        render(<WeeklyCalendar entries={entries} />, { wrapper: Wrapper });

        const list = await screen.findByRole('list', { name: 'Weekly anime schedule' });

        await waitFor(() => {
            expect(list).toHaveClass('weekly-calendar__list');
            expect(list).not.toHaveClass('weekly-calendar__grid');
        });
        const outer = list.closest('.weekly-calendar');
        expect(outer).not.toBeNull();
        expect((outer as HTMLElement).style.getPropertyValue('--columns')).toBe('');

        const days = screen.getAllByRole('listitem');
        expect(days).toHaveLength(7);
        days.forEach((day) => {
            expect(day).toHaveClass('day--row');
        });
    });

    it('hides empty days when emptyDaysMode is "hide"', async () => {
        setStoredSettings({ calendarLayout: 'grid', emptyDaysMode: 'hide' });
        const entries = [makeEntry(1, 0)];

        render(<WeeklyCalendar entries={entries} />, { wrapper: Wrapper });

        await screen.findByRole('list', { name: 'Weekly anime schedule' });

        await waitFor(() => {
            expect(screen.getAllByRole('listitem')).toHaveLength(1);
        });
    });
});
