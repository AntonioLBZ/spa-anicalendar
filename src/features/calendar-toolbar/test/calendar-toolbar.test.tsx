import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it } from 'vitest';

import { CalendarToolbar } from '../calendar-toolbar';

import type { CalendarStats } from '@/lib/airing';
import type { ReactNode } from 'react';

const messages = {
    calendarToolbar: {
        edit: 'Edit',
        save: 'Save',
        cancel: 'Cancel',
        hiddenCount: '{count} hidden',
        pendingEpisodes: 'Episodes pending: <b>{count}</b>',
        pendingEpisodesWithTime: 'Episodes pending: <b>{count}</b> (<b>{time}</b>)',
        nextEpisodeIn: 'Next episode in <b>{time}</b>',
        editHint: 'Personal hint',
        editSeasonalHint: 'Seasonal hint',
        hideAll: 'Hide all',
        showAll: 'Show all',
    },
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
    animeCard: {
        aired: 'Aired',
        countdownDays: '{days}d {hours}h',
        countdownHours: '{hours}h {minutes}m',
        countdownMinutes: '{minutes}m',
    },
};

const Wrapper = (props: { children: ReactNode }) => (
    <NextIntlClientProvider locale="en" messages={messages}>
        {props.children}
    </NextIntlClientProvider>
);

const stats: CalendarStats = {
    pendingEpisodes: 4,
    pendingMinutes: 96,
    nextAiringAt: Math.floor(Date.now() / 1000) + 3600,
};

const seasonalFiltersValue = { formats: [], topN: 50, onlyNewSeason: false };

const noop = () => {};

describe('CalendarToolbar showPendingStats', () => {
    it('shows the pending stat by default while keeping the next-airing stat', () => {
        render(
            <CalendarToolbar stats={stats} isEditMode={false} hiddenCount={0} onEnter={noop} onSave={noop} onCancel={noop} />,
            { wrapper: Wrapper }
        );

        expect(screen.getByText(/Episodes pending/)).toBeInTheDocument();
        expect(screen.getByText(/Next episode in/)).toBeInTheDocument();
    });

    it('hides the pending stat when showPendingStats is false, but keeps the next-airing stat', () => {
        render(
            <CalendarToolbar
                stats={stats}
                isEditMode={false}
                hiddenCount={0}
                onEnter={noop}
                onSave={noop}
                onCancel={noop}
                showPendingStats={false}
            />,
            { wrapper: Wrapper }
        );

        expect(screen.queryByText(/Episodes pending/)).not.toBeInTheDocument();
        expect(screen.getByText(/Next episode in/)).toBeInTheDocument();
    });
});

describe('CalendarToolbar hint text', () => {
    it('shows the personal hint by default', () => {
        render(
            <CalendarToolbar stats={stats} isEditMode={false} hiddenCount={0} onEnter={noop} onSave={noop} onCancel={noop} />,
            { wrapper: Wrapper }
        );

        expect(screen.getByText('Personal hint')).toBeInTheDocument();
    });

    it('shows the seasonal hint when isSeasonal is true', () => {
        render(
            <CalendarToolbar
                stats={stats}
                isEditMode={false}
                hiddenCount={0}
                onEnter={noop}
                onSave={noop}
                onCancel={noop}
                isSeasonal
            />,
            { wrapper: Wrapper }
        );

        expect(screen.getByText('Seasonal hint')).toBeInTheDocument();
        expect(screen.queryByText('Personal hint')).not.toBeInTheDocument();
    });
});

describe('CalendarToolbar bulk actions', () => {
    it('renders no "hide/show all" button when not in edit mode, even if a handler is provided', () => {
        render(
            <CalendarToolbar
                stats={stats}
                isEditMode={false}
                hiddenCount={0}
                onEnter={noop}
                onSave={noop}
                onCancel={noop}
                onToggleAll={noop}
            />,
            { wrapper: Wrapper }
        );

        expect(screen.queryByText('Hide all')).not.toBeInTheDocument();
    });

    it('renders "Hide all" (not "Show all") when not everything is hidden yet', () => {
        render(
            <CalendarToolbar
                stats={stats}
                isEditMode
                hiddenCount={0}
                onEnter={noop}
                onSave={noop}
                onCancel={noop}
                onToggleAll={noop}
                isAllHidden={false}
            />,
            { wrapper: Wrapper }
        );

        expect(screen.getByText('Hide all')).toBeInTheDocument();
        expect(screen.queryByText('Show all')).not.toBeInTheDocument();
    });

    it('renders "Show all" when isAllHidden is true', () => {
        render(
            <CalendarToolbar
                stats={stats}
                isEditMode
                hiddenCount={5}
                onEnter={noop}
                onSave={noop}
                onCancel={noop}
                onToggleAll={noop}
                isAllHidden
            />,
            { wrapper: Wrapper }
        );

        expect(screen.getByText('Show all')).toBeInTheDocument();
        expect(screen.queryByText('Hide all')).not.toBeInTheDocument();
    });

    it('renders no bulk-actions row at all when no handler is provided', () => {
        render(
            <CalendarToolbar stats={stats} isEditMode hiddenCount={0} onEnter={noop} onSave={noop} onCancel={noop} isSeasonal />,
            { wrapper: Wrapper }
        );

        expect(screen.queryByText('Hide all')).not.toBeInTheDocument();
        expect(screen.queryByText('Show all')).not.toBeInTheDocument();
    });
});

describe('CalendarToolbar seasonal filters', () => {
    it('renders the seasonal filters row above the rest of the toolbar when isSeasonal with a value and submit handler', () => {
        render(
            <CalendarToolbar
                stats={stats}
                isEditMode={false}
                hiddenCount={0}
                onEnter={noop}
                onSave={noop}
                onCancel={noop}
                isSeasonal
                seasonalFiltersValue={seasonalFiltersValue}
                onSeasonalFiltersSubmit={noop}
                isSeasonalFiltersHydrated
            />,
            { wrapper: Wrapper }
        );

        expect(screen.getByRole('checkbox', { name: 'TV' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
    });

    it('does not render the seasonal filters row when not seasonal, even with a value and handler', () => {
        render(
            <CalendarToolbar
                stats={stats}
                isEditMode={false}
                hiddenCount={0}
                onEnter={noop}
                onSave={noop}
                onCancel={noop}
                seasonalFiltersValue={seasonalFiltersValue}
                onSeasonalFiltersSubmit={noop}
            />,
            { wrapper: Wrapper }
        );

        expect(screen.queryByRole('checkbox', { name: 'TV' })).not.toBeInTheDocument();
    });

    it('does not render the seasonal filters row when seasonal but no value/handler is provided', () => {
        render(
            <CalendarToolbar stats={stats} isEditMode={false} hiddenCount={0} onEnter={noop} onSave={noop} onCancel={noop} isSeasonal />,
            { wrapper: Wrapper }
        );

        expect(screen.queryByRole('checkbox', { name: 'TV' })).not.toBeInTheDocument();
    });
});
