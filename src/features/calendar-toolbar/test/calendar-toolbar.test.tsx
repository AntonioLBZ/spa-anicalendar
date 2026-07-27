import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { IntlTestWrapper as Wrapper } from '@/lib/test/intl-wrapper';

import { CalendarToolbar } from '../calendar-toolbar';

import type { CalendarStats } from '@/lib/airing';
import type { User } from '@/services';

const { useUserContext } = vi.hoisted(() => ({ useUserContext: vi.fn() }));

vi.mock('@/contexts/user-context', () => ({ useUserContext }));

const stats: CalendarStats = {
    pendingEpisodes: 4,
    pendingMinutes: 96,
    nextAiringAt: Math.floor(Date.now() / 1000) + 3600,
};

const fakeUser: User = { id: 1, name: 'kanade', avatarUrl: '', siteUrl: '' };

beforeEach(() => {
    useUserContext.mockReturnValue({ user: fakeUser });
});

describe('CalendarToolbar showPendingStats', () => {
    it('shows the pending stat when there is a signed-in user, keeping the next-airing stat', () => {
        useUserContext.mockReturnValue({ user: fakeUser });

        render(<CalendarToolbar stats={stats} isEditMode={false} hiddenCount={0} />, { wrapper: Wrapper });

        expect(screen.getByText(/Episodes pending/)).toBeInTheDocument();
        expect(screen.getByText(/Next episode in/)).toBeInTheDocument();
    });

    it('hides the pending stat when there is no user (seasonal browsing), but keeps the next-airing stat', () => {
        useUserContext.mockReturnValue({ user: undefined });

        render(<CalendarToolbar stats={stats} isEditMode={false} hiddenCount={0} />, { wrapper: Wrapper });

        expect(screen.queryByText(/Episodes pending/)).not.toBeInTheDocument();
        expect(screen.getByText(/Next episode in/)).toBeInTheDocument();
    });
});
