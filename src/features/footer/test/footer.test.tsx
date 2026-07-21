import { render, screen, within } from '@testing-library/react';
import { useSearchParams } from 'next/navigation';
import { describe, expect, it, vi } from 'vitest';

import { usePathname } from '@/lib/i18n/navigation';
import { IntlTestWrapper } from '@/lib/test/intl-wrapper';

import { Footer } from '../footer';

vi.mock('next/navigation', () => ({
    useSearchParams: vi.fn(() => new URLSearchParams()),
}));

vi.mock('@/lib/i18n/navigation', () => ({
    usePathname: vi.fn(() => '/airing'),
    Link: ({ href, locale, children, ...rest }: { href: unknown; locale?: string; children: React.ReactNode }) => (
        <a href={typeof href === 'string' ? href : JSON.stringify(href)} data-locale={locale} {...rest}>
            {children}
        </a>
    ),
}));

describe('Footer', () => {
    it('renders the active locale as plain text and the other as a link', () => {
        render(<Footer />, { wrapper: IntlTestWrapper });

        expect(screen.getByText('English')).not.toHaveAttribute('href');
        expect(screen.getByRole('link', { name: 'Español' })).toBeInTheDocument();
    });

    it('links to the same path/query in the other locale', () => {
        vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams('username=foo') as ReturnType<
            typeof useSearchParams
        >);
        render(<Footer />, { wrapper: IntlTestWrapper });

        const link = screen.getByRole('link', { name: 'Español' });
        expect(link).toHaveAttribute('data-locale', 'es');
        expect(link).toHaveAttribute('href', JSON.stringify({ pathname: '/airing', query: { username: 'foo' } }));
    });

    it('renders the contact links pointing at the right external destinations', () => {
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
