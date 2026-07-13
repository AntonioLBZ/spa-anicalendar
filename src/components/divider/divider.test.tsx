import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Divider } from './divider';

describe('Divider', () => {
    it('merges a custom className with the base divider class', () => {
        render(<Divider className="weekly-calendar__divider" />);

        const divider = screen.getByRole('separator');
        expect(divider).toHaveClass('divider', 'weekly-calendar__divider');
    });
});
