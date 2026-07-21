import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { IntlTestWrapper as Wrapper } from '@/lib/test/intl-wrapper';

import { CalendarToolbar } from '../calendar-toolbar';

import type { CalendarStats } from '@/lib/airing';

const stats: CalendarStats = {
    pendingEpisodes: 4,
    pendingMinutes: 96,
    nextAiringAt: Math.floor(Date.now() / 1000) + 3600,
};

const noop = () => {};

describe('CalendarToolbar showPendingStats', () => {
    it('shows the pending stat by default while keeping the next-airing stat', () => {
        render(
            <CalendarToolbar
                stats={stats}
                isEditMode={false}
                hiddenCount={0}
                onEnter={noop}
                onSave={noop}
                onCancel={noop}
            />,
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
            <CalendarToolbar
                stats={stats}
                isEditMode
                hiddenCount={0}
                onEnter={noop}
                onSave={noop}
                onCancel={noop}
                isSeasonal
            />,
            { wrapper: Wrapper }
        );

        expect(screen.queryByText('Hide all')).not.toBeInTheDocument();
        expect(screen.queryByText('Show all')).not.toBeInTheDocument();
    });
});
