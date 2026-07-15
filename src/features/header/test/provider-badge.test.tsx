import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ProviderBadge } from '../provider-badge';

describe('ProviderBadge', () => {
    it('renders a distinct label per provider', () => {
        const { rerender } = render(<ProviderBadge provider="anilist" />);
        expect(screen.getByTitle('anilist')).toHaveTextContent('A');

        rerender(<ProviderBadge provider="myanimelist" />);
        expect(screen.getByTitle('myanimelist')).toHaveTextContent('M');

        rerender(<ProviderBadge provider="kitsu" />);
        expect(screen.getByTitle('kitsu')).toHaveTextContent('K');

        rerender(<ProviderBadge provider="mock" />);
        expect(screen.getByTitle('mock')).toHaveTextContent('?');
    });

    it('uses a different background color per provider', () => {
        const { rerender, container } = render(<ProviderBadge provider="anilist" />);
        const anilistColor = container.querySelector('.provider-badge')?.getAttribute('style');

        rerender(<ProviderBadge provider="kitsu" />);
        const kitsuColor = container.querySelector('.provider-badge')?.getAttribute('style');

        expect(anilistColor).not.toBe(kitsuColor);
    });
});
