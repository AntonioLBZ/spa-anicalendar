import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Link } from '../index';

describe('Link', () => {
    it('renders a plain link with just the custom className by default', () => {
        render(
            <Link className="footer__link" href="https://example.com">
                Example
            </Link>
        );

        const link = screen.getByRole('link', { name: 'Example' });
        expect(link).toHaveClass('footer__link');
        expect(link).not.toHaveClass('button');
    });

    it('applies Button-matching classes when given a variant', () => {
        render(
            <Link variant="primary" size="m" className="not-found__link" href="/">
                Back home
            </Link>
        );

        const link = screen.getByRole('link', { name: 'Back home' });
        expect(link).toHaveClass('button', 'button--primary', 'button--size-m', 'label-m', 'not-found__link');
    });

    it('renders as a custom component via `as` while keeping variant classes', () => {
        const CustomAnchor = (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a data-custom {...props} />;

        render(
            <Link as={CustomAnchor} variant="secondary" href="/airing">
                Browse
            </Link>
        );

        const link = screen.getByRole('link', { name: 'Browse' });
        expect(link).toHaveAttribute('data-custom');
        expect(link).toHaveClass('button', 'button--secondary');
    });
});
