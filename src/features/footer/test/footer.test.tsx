import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useSearchParams } from 'next/navigation';
import { describe, expect, it, vi } from 'vitest';

import { usePathname, useRouter } from '@/lib/i18n/navigation';
import { IntlTestWrapper } from '@/lib/test/intl-wrapper';

import { Footer } from '../footer';

vi.mock('next/navigation', () => ({
    useSearchParams: vi.fn(() => new URLSearchParams()),
}));

vi.mock('@/lib/i18n/navigation', () => ({
    usePathname: vi.fn(() => '/airing'),
    useRouter: vi.fn(),
}));

describe('Footer', () => {
    it('disables the button for the active locale and enables the other', () => {
        const replace = vi.fn();
        vi.mocked(useRouter).mockReturnValue({ replace } as unknown as ReturnType<typeof useRouter>);
        render(<Footer />, { wrapper: IntlTestWrapper });

        expect(screen.getByRole('button', { name: 'English' })).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Español' })).toBeEnabled();
    });

    it('navigates to the same path/query in the other locale when clicked', async () => {
        const replace = vi.fn();
        vi.mocked(useRouter).mockReturnValue({ replace } as unknown as ReturnType<typeof useRouter>);
        vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams('username=foo') as ReturnType<
            typeof useSearchParams
        >);
        const user = userEvent.setup();
        render(<Footer />, { wrapper: IntlTestWrapper });

        await user.click(screen.getByRole('button', { name: 'Español' }));

        expect(replace).toHaveBeenCalledWith({ pathname: '/airing', query: { username: 'foo' } }, { locale: 'es' });
    });

    it('renders the contact links pointing at the right external destinations', () => {
        vi.mocked(useRouter).mockReturnValue({ replace: vi.fn() } as unknown as ReturnType<typeof useRouter>);
        render(<Footer />, { wrapper: IntlTestWrapper });

        const group = screen.getByRole('group', { name: 'Contact' });
        expect(within(group).getByRole('link', { name: 'GitHub' })).toHaveAttribute(
            'href',
            'https://github.com/AntonioLBZ'
        );
        expect(within(group).getByRole('link', { name: 'AniList' })).toHaveAttribute(
            'href',
            'https://anilist.co/user/LanZor'
        );
        expect(within(group).getByRole('link', { name: 'Report an issue' })).toHaveAttribute('target', '_blank');
    });
});
