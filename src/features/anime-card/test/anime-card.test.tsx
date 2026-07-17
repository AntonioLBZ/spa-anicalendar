import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it } from 'vitest';

import { SettingsProvider } from '@/contexts';

import { AnimeCard } from '../anime-card';

import type { AnimeEntry } from '@/services';
import type { ReactNode } from 'react';

const messages = {
    animeCard: {
        toggleDetails: 'Show details',
        next: 'Next',
        behind: '{count} behind',
        caughtUp: 'Caught up!',
        unknown: 'unknown',
        episodeProgress: 'Ep {progress}/{total}',
        episodeProgressUnknown: 'Ep {progress}/?',
        episodeProgressAria: 'Episode {progress} of {total}',
        aired: 'Aired',
        countdownDays: '{days}d {hours}h',
        countdownHours: '{hours}h {minutes}m',
        countdownMinutes: '{minutes}m',
        status: {
            releasing: 'Releasing',
            finished: 'Finished',
            hiatus: 'Hiatus',
            cancelled: 'Cancelled',
            notYetReleased: 'Not yet released',
        },
    },
};

const Wrapper = (props: { children: ReactNode }) => (
    <NextIntlClientProvider locale="en" messages={messages}>
        <SettingsProvider>{props.children}</SettingsProvider>
    </NextIntlClientProvider>
);

const entry: AnimeEntry = {
    id: 1,
    mediaId: 1,
    title: 'Test Anime',
    coverImageUrl: 'https://example.com/cover.jpg',
    episodes: 12,
    status: 'RELEASING',
    siteUrl: 'https://example.com/anime/1',
    endDate: {},
    isAdult: false,
    genres: [],
    progress: 3,
    repeat: 0,
};

describe('AnimeCard info toggle', () => {
    it('starts collapsed and toggles aria-expanded on each click', async () => {
        const user = userEvent.setup();
        render(<AnimeCard entry={entry} />, { wrapper: Wrapper });

        const toggle = screen.getByRole('button', { name: 'Show details' });
        expect(toggle).toHaveAttribute('aria-expanded', 'false');

        await user.click(toggle);
        expect(toggle).toHaveAttribute('aria-expanded', 'true');

        await user.click(toggle);
        expect(toggle).toHaveAttribute('aria-expanded', 'false');
    });

    it('keeps focus on the info button after clicking it (no .blur() side effect)', async () => {
        const user = userEvent.setup();
        render(<AnimeCard entry={entry} />, { wrapper: Wrapper });

        const toggle = screen.getByRole('button', { name: 'Show details' });

        await user.click(toggle);

        expect(document.activeElement).toBe(toggle);
    });
});

describe('AnimeCard showProgress', () => {
    it('omits all progress UI when showProgress is false, without crashing on undefined progress', () => {
        const anonymousEntry: AnimeEntry = { ...entry, progress: undefined, repeat: undefined };
        render(<AnimeCard entry={anonymousEntry} showProgress={false} />, { wrapper: Wrapper });

        expect(screen.queryByText(/Ep \d+\/\d+/)).not.toBeInTheDocument();
        expect(screen.queryByText(/behind/)).not.toBeInTheDocument();
        expect(screen.queryByText('Caught up!')).not.toBeInTheDocument();
    });

    it('renders progress UI by default (showProgress defaults to true)', () => {
        render(<AnimeCard entry={entry} />, { wrapper: Wrapper });

        expect(screen.getByText('Ep 3/12')).toBeInTheDocument();
    });
});
