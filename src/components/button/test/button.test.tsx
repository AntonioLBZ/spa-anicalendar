import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Button } from '../button';

describe('Button', () => {
    it('defaults to variant=primary and size=m', () => {
        render(<Button>Go</Button>);

        const button = screen.getByRole('button', { name: 'Go' });
        expect(button).toHaveClass('button', 'button--primary', 'button--size-m');
    });

    it('applies the requested variant and size, merging a custom className', () => {
        render(
            <Button variant="ghost" size="s" className="settings__trigger">
                Go
            </Button>,
        );

        const button = screen.getByRole('button', { name: 'Go' });
        expect(button).toHaveClass('button--ghost', 'button--size-s', 'settings__trigger');
    });
});
