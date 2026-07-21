import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Section } from '../index';

describe('Section', () => {
    it('merges a custom className with the base section class', () => {
        render(
            <Section.Root className="settings__section" data-testid="section">
                <Section.Title>Theme</Section.Title>
            </Section.Root>
        );

        expect(screen.getByTestId('section')).toHaveClass('section', 'settings__section');
    });
});
