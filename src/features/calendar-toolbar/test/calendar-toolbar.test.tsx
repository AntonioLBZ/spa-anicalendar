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
        editHint: 'hint',
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
