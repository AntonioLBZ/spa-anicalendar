import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { SettingsProvider } from '@/contexts';
import { getTodayIndex } from '@/lib/airing';
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

describe('WeeklyCalendar loading state', () => {
    it('announces loading and shows a placeholder schedule instead of the empty message', async () => {
        setStoredSettings({ calendarLayout: 'grid' });

        const { container } = render(<WeeklyCalendar entries={[]} isLoading emptyMessage="Nothing here" />, {
            wrapper: Wrapper,
        });

        expect(await screen.findByRole('status')).toHaveTextContent('Loading schedule…');
        expect(screen.queryByText('Nothing here')).not.toBeInTheDocument();
        expect(screen.queryByRole('list')).not.toBeInTheDocument();
        expect(container.querySelector('.weekly-calendar')).toHaveAttribute('aria-busy', 'true');
        expect(container.querySelectorAll('.day')).toHaveLength(7);
        expect(container.querySelectorAll('.day__skeleton-card').length).toBeGreaterThan(0);
    });

    it('shows the empty message once loading finishes with no entries', async () => {
        setStoredSettings({ calendarLayout: 'grid' });

        render(<WeeklyCalendar entries={[]} isLoading={false} emptyMessage="Nothing here" />, { wrapper: Wrapper });

        expect(await screen.findByText('Nothing here')).toBeInTheDocument();
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
});

describe("WeeklyCalendar today's column", () => {
    it('dims entries whose episode already aired today, and only in that column', async () => {
        setStoredSettings({ calendarLayout: 'grid' });
        const todayIndex = getTodayIndex('monday');
        // The mocked airing day is the timestamp itself, so these episodes are long past, not later today
        const entries = [makeEntry(1, todayIndex), makeEntry(2, (todayIndex + 1) % 7)];

        render(<WeeklyCalendar entries={entries} />, { wrapper: Wrapper });

        const airedToday = (await screen.findByText('Anime 1')).closest('.card');
        const otherDay = screen.getByText('Anime 2').closest('.card');
        expect(airedToday).toHaveClass('card--aired');
        expect(otherDay).not.toHaveClass('card--aired');
    });
});
