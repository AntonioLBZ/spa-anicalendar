import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { SettingsProvider } from '@/contexts';
import { IntlTestWrapper } from '@/lib/test/intl-wrapper';

import { AnimeCard } from '../anime-card';

import type { AnimeEntry } from '@/services';
import type { ReactNode } from 'react';

const Wrapper = (props: { children: ReactNode }) => (
    <IntlTestWrapper>
        <SettingsProvider>{props.children}</SettingsProvider>
    </IntlTestWrapper>
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
    it('omits the progress badge entirely when progress is undefined, without crashing', () => {
        const noProgressEntry: AnimeEntry = { ...entry, progress: undefined, repeat: undefined };
        render(<AnimeCard entry={noProgressEntry} />, { wrapper: Wrapper });

        expect(screen.queryByText(/Ep \d+\/\d+/)).not.toBeInTheDocument();
    });

    it('omits the progress badge when showProgress is false, even with progress defined', () => {
        render(<AnimeCard entry={entry} showProgress={false} />, { wrapper: Wrapper });

        expect(screen.queryByText(/Ep \d+\/\d+/)).not.toBeInTheDocument();
    });

    it('renders progress UI by default (showProgress defaults to true)', () => {
        render(<AnimeCard entry={entry} />, { wrapper: Wrapper });

        expect(screen.getByText('Ep 3/12')).toBeInTheDocument();
    });
});

describe('AnimeCard title visibility', () => {
    it('renders the title outside the hover content when there is no next airing episode', () => {
        const { container } = render(<AnimeCard entry={{ ...entry, nextAiringEpisode: undefined }} />, {
            wrapper: Wrapper,
        });

        const title = screen.getByText('Test Anime');
        expect(container.querySelector('.card__hover-content')?.contains(title)).toBe(false);
    });

    it('renders the title inside the hover content when there is a next airing episode', () => {
        const { container } = render(
            <AnimeCard entry={{ ...entry, nextAiringEpisode: { airingAt: 1700000000, episode: 4 } }} />,
            { wrapper: Wrapper }
        );

        const title = screen.getByText('Test Anime');
        expect(container.querySelector('.card__hover-content')?.contains(title)).toBe(true);
    });
});

describe('AnimeCard week skip', () => {
    it('shows a week-skip suffix when the next episode airs beyond the current calendar week', () => {
        const farFuture = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
        render(<AnimeCard entry={{ ...entry, nextAiringEpisode: { airingAt: farFuture, episode: 4 } }} />, {
            wrapper: Wrapper,
        });

        expect(screen.getByText(/\+ \d+ weeks?/)).toBeInTheDocument();
    });

    it('omits the week-skip suffix when the next episode airs later this week', () => {
        const soon = Math.floor(Date.now() / 1000) + 60 * 60;
        render(<AnimeCard entry={{ ...entry, nextAiringEpisode: { airingAt: soon, episode: 4 } }} />, {
            wrapper: Wrapper,
        });

        expect(screen.queryByText(/\+ \d+ weeks?/)).not.toBeInTheDocument();
    });
});

describe('AnimeCard showWatchStatus', () => {
    it('shows the "Ep X/Y" badge using episodes-aired progress, but omits behind/caught-up, when showWatchStatus is false', () => {
        // Anonymous/seasonal entries: progress holds "episodes aired so far" (see seasonal.selector.ts),
        // not a user's watch count — the badge is still meaningful, but "behind"/"caught up" is not.
        const seasonalEntry: AnimeEntry = { ...entry, progress: 4, repeat: undefined };
        render(<AnimeCard entry={seasonalEntry} showWatchStatus={false} />, { wrapper: Wrapper });

        expect(screen.getByText('Ep 4/12')).toBeInTheDocument();
        expect(screen.queryByText(/behind/)).not.toBeInTheDocument();
        expect(screen.queryByText('Caught up!')).not.toBeInTheDocument();
    });

    it('renders "caught up"/"behind" by default (showWatchStatus defaults to true)', () => {
        render(<AnimeCard entry={{ ...entry, progress: 3, nextAiringEpisode: { airingAt: 1700000000, episode: 4 } }} />, {
            wrapper: Wrapper,
        });

        expect(screen.getByText('Caught up!')).toBeInTheDocument();
    });
});

describe('AnimeCard motion states', () => {
    const getCard = (container: HTMLElement) => container.querySelector('.card') as HTMLElement;

    it('marks the cover as loaded only once the image has loaded', async () => {
        const { container } = render(<AnimeCard entry={entry} />, { wrapper: Wrapper });

        expect(getCard(container)).not.toHaveClass('card--image-loaded');
        fireEvent.load(screen.getByRole('img', { name: 'Test Anime' }));
        // next/image reports the load after decoding, asynchronously
        await waitFor(() => expect(getCard(container)).toHaveClass('card--image-loaded'));
    });

    it('caps the entrance stagger index', () => {
        const { container } = render(<AnimeCard entry={entry} enterIndex={40} />, { wrapper: Wrapper });

        expect(getCard(container).style.getPropertyValue('--card-index')).toBe('12');
    });

    it('flags the next-airing card only during the last hour before airing', () => {
        const now = Math.floor(Date.now() / 1000);
        const soon = { ...entry, nextAiringEpisode: { airingAt: now + 30 * 60, episode: 4 } };
        const later = { ...entry, nextAiringEpisode: { airingAt: now + 3 * 3600, episode: 4 } };

        const { container, rerender } = render(<AnimeCard entry={soon} isNextAiring />, { wrapper: Wrapper });
        expect(getCard(container)).toHaveClass('card--airing-soon');

        rerender(<AnimeCard entry={later} isNextAiring />);
        expect(getCard(container)).not.toHaveClass('card--airing-soon');

        rerender(<AnimeCard entry={soon} />);
        expect(getCard(container)).not.toHaveClass('card--airing-soon');
    });
});
