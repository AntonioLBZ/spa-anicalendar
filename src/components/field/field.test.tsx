import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Field } from './index';

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
