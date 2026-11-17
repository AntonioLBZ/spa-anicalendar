import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { IntlTestWrapper as Wrapper } from '@/lib/test/intl-wrapper';

import { DomainMoveDialog } from '../domain-move-dialog';

const legacy = vi.hoisted(() => ({ value: true }));

vi.mock('@/lib/site-migration', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@/lib/site-migration')>()),
    isLegacyHost: () => legacy.value,
}));

const setStandalone = (matches: boolean) => {
    vi.spyOn(window, 'matchMedia').mockImplementation(
        (query) => ({ matches: matches && query.includes('standalone'), media: query }) as MediaQueryList
    );
};

afterEach(() => {
    legacy.value = true;
    vi.restoreAllMocks();
});

describe('DomainMoveDialog', () => {
    it('tells visitors on the old domain about the new address', async () => {
        setStandalone(false);
        render(<DomainMoveDialog />, { wrapper: Wrapper });

        expect(await screen.findByRole('dialog', { name: 'Anicalendar is moving' })).toBeInTheDocument();
        expect(screen.getByText('anicalendar.albz.app')).toBeInTheDocument();
        expect(screen.queryByText(/You have the app installed/)).not.toBeInTheDocument();
    });

    it('asks installed apps to reinstall from the new address', async () => {
        setStandalone(true);
        render(<DomainMoveDialog />, { wrapper: Wrapper });

        expect(await screen.findByText(/You have the app installed/)).toBeInTheDocument();
    });

    it('can be postponed', async () => {
        setStandalone(false);
        render(<DomainMoveDialog />, { wrapper: Wrapper });

        await userEvent.click(await screen.findByRole('button', { name: 'Later' }));

        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    });

    it('stays hidden on the new domain', () => {
        legacy.value = false;
        render(<DomainMoveDialog />, { wrapper: Wrapper });

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
});
