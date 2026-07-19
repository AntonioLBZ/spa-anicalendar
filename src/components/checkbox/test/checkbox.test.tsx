import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Checkbox } from '../index';

describe('Checkbox', () => {
    it('renders a single checkbox reflecting isSelected', () => {
        render(<Checkbox.Option isSelected>Adult</Checkbox.Option>);

        expect(screen.getByRole('checkbox', { name: 'Adult' })).toBeChecked();
    });

    it('merges custom classNames on the group and its options', () => {
        render(
            <Checkbox.Group aria-label="Format" value={['TV']} className="seasonal-filters__group">
                <Checkbox.Option value="TV" className="seasonal-filters__option">
                    TV
                </Checkbox.Option>
            </Checkbox.Group>
        );

        expect(screen.getByRole('group')).toHaveClass('checkbox-group', 'seasonal-filters__group');

        const checkboxLabel = screen.getByRole('checkbox', { name: 'TV' }).closest('label');
        expect(checkboxLabel).toHaveClass('checkbox', 'body-m', 'seasonal-filters__option');
    });

    it('reports the plain typed array on change, no manual cast needed at call sites', async () => {
        const onChange = vi.fn();
        const user = userEvent.setup();

        render(
            <Checkbox.Group aria-label="Format" value={['TV']} onChange={onChange}>
                <Checkbox.Option value="TV">TV</Checkbox.Option>
                <Checkbox.Option value="MOVIE">Movie</Checkbox.Option>
            </Checkbox.Group>
        );

        await user.click(screen.getByRole('checkbox', { name: 'Movie' }));

        expect(onChange).toHaveBeenCalledWith(['TV', 'MOVIE']);
    });
});
