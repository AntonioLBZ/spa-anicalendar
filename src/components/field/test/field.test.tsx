import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Field } from '../index';

import type { SubmitEvent } from 'react';

describe('Field', () => {
    it('associates the label with the input despite the Field.Control wrapper', () => {
        render(
            <Field.Root>
                <Field.Control>
                    <Field.Input />
                    <Field.Label>Username</Field.Label>
                </Field.Control>
            </Field.Root>,
        );

        expect(screen.getByLabelText('Username')).toBeInTheDocument();
    });

    it('shows Field.Error and marks the input invalid when isInvalid is set', () => {
        render(
            <Field.Root isInvalid>
                <Field.Control>
                    <Field.Input />
                    <Field.Label>Username</Field.Label>
                </Field.Control>
                <Field.Error>User not found.</Field.Error>
            </Field.Root>,
        );

        const input = screen.getByLabelText('Username');
        expect(input).toBeInvalid();
        expect(input).toHaveAccessibleDescription('User not found.');
    });

    it('does not render Field.Error when isInvalid is false', () => {
        render(
            <Field.Root isInvalid={false}>
                <Field.Control>
                    <Field.Input />
                    <Field.Label>Username</Field.Label>
                </Field.Control>
                <Field.Error>User not found.</Field.Error>
            </Field.Root>,
        );

        expect(screen.queryByText('User not found.')).not.toBeInTheDocument();
    });

    it('does not block native form submission while isInvalid is true', async () => {
        const onSubmit = vi.fn((e: SubmitEvent) => e.preventDefault());
        const user = userEvent.setup();

        render(
            <form onSubmit={onSubmit}>
                <Field.Root isInvalid>
                    <Field.Control>
                        <Field.Input />
                        <Field.Label>Username</Field.Label>
                    </Field.Control>
                    <Field.Error>User not found.</Field.Error>
                </Field.Root>
                <button type="submit">Go</button>
            </form>,
        );

        await user.click(screen.getByRole('button', { name: 'Go' }));

        // react-aria-components defaults TextField's validationBehavior to
        // 'native', which calls input.setCustomValidity() when isInvalid is set —
        // that silently blocks the browser's submit event. Field.Root forces
        // validationBehavior="aria" specifically to avoid this footgun.
        expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    it('hides Field.Clear when the field is empty', () => {
        render(
            <Field.Root value="" onChange={() => {}}>
                <Field.Control>
                    <Field.Input />
                    <Field.Label>Username</Field.Label>
                    <Field.Clear aria-label="Clear" />
                </Field.Control>
            </Field.Root>,
        );

        expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
    });

    it('clears the value when Field.Clear is pressed', async () => {
        const onChange = vi.fn();
        const user = userEvent.setup();

        render(
            <Field.Root value="antoniolbz" onChange={onChange}>
                <Field.Control>
                    <Field.Input />
                    <Field.Label>Username</Field.Label>
                    <Field.Clear aria-label="Clear" />
                </Field.Control>
            </Field.Root>,
        );

        await user.click(screen.getByRole('button', { name: 'Clear' }));

        expect(onChange).toHaveBeenCalledWith('');
    });

    it('fixes Field.Helper to the description slot', () => {
        render(
            <Field.Root>
                <Field.Control>
                    <Field.Input />
                    <Field.Label>Username</Field.Label>
                </Field.Control>
                <Field.Helper>Your public AniList username.</Field.Helper>
            </Field.Root>,
        );

        expect(screen.getByLabelText('Username')).toHaveAccessibleDescription('Your public AniList username.');
    });
});
