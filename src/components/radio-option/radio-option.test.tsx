import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Radio } from './index';

describe('Radio', () => {
    it('defaults orientation to horizontal (react-aria itself defaults to vertical)', () => {
        render(
            <Radio.Group aria-label="Choose" value="a">
                <Radio.Option value="a">Option A</Radio.Option>
            </Radio.Group>,
        );

        expect(screen.getByRole('radiogroup')).toHaveAttribute('data-orientation', 'horizontal');
    });

    it('merges custom classNames on the group and its options', () => {
        render(
            <Radio.Group aria-label="Choose" value="a" className="home__radio-group">
                <Radio.Option value="a" className="home__radio-option">
                    Option A
                </Radio.Option>
            </Radio.Group>,
        );

        expect(screen.getByRole('radiogroup')).toHaveClass('radio-option-group', 'home__radio-group');

        // The className merge lands on the <label> wrapping the (visually hidden)
        // native radio input, not on the input itself — climb to it explicitly.
        const radioLabel = screen.getByRole('radio', { name: 'Option A' }).closest('label');
        expect(radioLabel).toHaveClass('radio-option', 'body-m', 'home__radio-option');
    });
});
