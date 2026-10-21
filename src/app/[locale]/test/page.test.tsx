import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { SettingsProvider } from '@/contexts';
import { IntlTestWrapper } from '@/lib/test/intl-wrapper';
import { MemoryStorage } from '@/lib/test/memory-storage';
import { AnilistUserNotFoundError } from '@/services/api/anilist/client';

import HomePage from '../page';

import type { ReactNode } from 'react';

const getUserByName = vi.hoisted(() => vi.fn());
const push = vi.hoisted(() => vi.fn());

vi.mock('@/services', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@/services')>()),
    getProvider: () => ({ getUserByName }),
}));
vi.mock('@/lib/i18n/navigation', () => ({
    useRouter: () => ({ push }),
    Link: ({ children, href }: { children: ReactNode; href: string }) => <a href={href}>{children}</a>,
}));
vi.mock('../airing/use-seasonal-airing-data', () => ({
    useSeasonalAiringData: () => ({ data: { entries: [] } }),
}));

const memoryStorage = new MemoryStorage();

const renderHome = () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    return render(
        <QueryClientProvider client={queryClient}>
            <IntlTestWrapper>
                <SettingsProvider>
                    <HomePage />
                </SettingsProvider>
            </IntlTestWrapper>
        </QueryClientProvider>
    );
};

const submitUsername = async (username: string) => {
    const user = userEvent.setup();
    await user.type(screen.getByRole('textbox'), username);
    await user.click(screen.getByRole('button', { name: 'Search' }));
};

beforeEach(() => {
    vi.stubGlobal('localStorage', memoryStorage);
    getUserByName.mockReset();
    push.mockReset();
});

afterEach(() => {
    vi.unstubAllGlobals();
    memoryStorage.clear();
});

describe('HomePage submit', () => {
    it('names the provider when it cannot be reached, e.g. a CORS-blocked maintenance page', async () => {
        getUserByName.mockRejectedValue(new TypeError('Failed to fetch'));
        renderHome();

        await submitUsername('someone');

        expect(await screen.findByText(/couldn't reach AniList/)).toBeInTheDocument();
        expect(push).not.toHaveBeenCalled();
    });

    it('keeps the "user not found" message for a missing profile', async () => {
        getUserByName.mockRejectedValue(new AnilistUserNotFoundError('AniList API error: 404'));
        renderHome();

        await submitUsername('nobody');

        expect(await screen.findByText(/User not found/)).toBeInTheDocument();
        expect(screen.queryByText(/couldn't reach/)).not.toBeInTheDocument();
    });

    it('opens the calendar when the user exists', async () => {
        getUserByName.mockResolvedValue({ id: 1, name: 'someone' });
        renderHome();

        await submitUsername('someone');

        await waitFor(() => expect(push).toHaveBeenCalledWith('/airing/someone'));
    });
});
