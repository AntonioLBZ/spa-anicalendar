import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { IntlTestWrapper } from '@/lib/test/intl-wrapper';

import { ProfileBanner } from '../profile-banner';

import type { User } from '@/services';

const user: User = {
    id: 42,
    name: 'lanzorzx',
    avatarUrl: 'https://example.com/avatar.png',
    siteUrl: 'https://anilist.co/user/lanzorzx',
    bannerUrl: 'https://example.com/banner.jpg',
};

const getBanner = (container: HTMLElement) => container.querySelector('.profile-banner') as HTMLElement;

describe('ProfileBanner', () => {
    it("shows the user's name as the page heading and links to their profile", () => {
        render(<ProfileBanner user={user} provider="anilist" />, { wrapper: IntlTestWrapper });

        expect(screen.getByRole('heading', { level: 1, name: 'lanzorzx' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'View profile on AniList' })).toHaveAttribute(
            'href',
            'https://anilist.co/user/lanzorzx'
        );
    });

    it('draws the banner image above the identity, when the user has one', () => {
        const { container, rerender } = render(<ProfileBanner user={user} provider="anilist" />, {
            wrapper: IntlTestWrapper,
        });

        // Outside Next's config the image goes through the optimizer, so the source is URL-encoded
        expect(container.querySelector('.profile-banner__image')?.getAttribute('src')).toContain(
            encodeURIComponent(user.bannerUrl!)
        );

        rerender(<ProfileBanner user={{ ...user, bannerUrl: undefined }} provider="myanimelist" />);

        expect(container.querySelector('.profile-banner__image')).not.toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'View profile on MyAnimeList' })).toBeInTheDocument();
    });

    it('keeps its space while the user loads', () => {
        const { container } = render(<ProfileBanner provider="anilist" />, { wrapper: IntlTestWrapper });

        expect(getBanner(container)).toHaveAttribute('aria-busy', 'true');
        expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    });
});
