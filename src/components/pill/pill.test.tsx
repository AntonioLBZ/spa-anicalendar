import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Pill } from './pill';

describe('Pill', () => {
    it('renders its children', () => {
        render(<Pill>Today</Pill>);

        expect(screen.getByText('Today')).toBeInTheDocument();
    });

    it('merges a custom className with the base class', () => {
        render(<Pill className="card__next-airing">Next</Pill>);

        const pill = screen.getByText('Next');
        expect(pill).toHaveClass('pill');
        expect(pill).toHaveClass('card__next-airing');
    });
});
