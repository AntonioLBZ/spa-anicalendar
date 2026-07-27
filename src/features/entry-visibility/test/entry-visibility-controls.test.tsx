import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { IntlTestWrapper as Wrapper } from '@/lib/test/intl-wrapper';

import { EntryVisibilityControls } from '../entry-visibility-controls';

const noop = () => {};

describe('EntryVisibilityControls bulk actions', () => {
    it('renders no "hide/show all" button when not in edit mode, even if a handler is provided', () => {
        render(
            <EntryVisibilityControls
                isEditMode={false}
                onEnter={noop}
                onSave={noop}
                onCancel={noop}
                onToggleAll={noop}
            />,
            { wrapper: Wrapper }
        );

        expect(screen.queryByText('Hide all')).not.toBeInTheDocument();
    });

    it('renders "Hide all" (not "Show all") when not everything is hidden yet', () => {
        render(
            <EntryVisibilityControls
                isEditMode
                onEnter={noop}
                onSave={noop}
                onCancel={noop}
                onToggleAll={noop}
                isAllHidden={false}
            />,
            { wrapper: Wrapper }
        );

        expect(screen.getByText('Hide all')).toBeInTheDocument();
        expect(screen.queryByText('Show all')).not.toBeInTheDocument();
    });

    it('renders "Show all" when isAllHidden is true', () => {
        render(
            <EntryVisibilityControls
                isEditMode
                onEnter={noop}
                onSave={noop}
                onCancel={noop}
                onToggleAll={noop}
                isAllHidden
            />,
            { wrapper: Wrapper }
        );

        expect(screen.getByText('Show all')).toBeInTheDocument();
        expect(screen.queryByText('Hide all')).not.toBeInTheDocument();
    });

    it('renders no bulk-actions button at all when no handler is provided', () => {
        render(<EntryVisibilityControls isEditMode onEnter={noop} onSave={noop} onCancel={noop} />, {
            wrapper: Wrapper,
        });

        expect(screen.queryByText('Hide all')).not.toBeInTheDocument();
        expect(screen.queryByText('Show all')).not.toBeInTheDocument();
    });

    it('renders an icon-only trigger with an accessible label when not in edit mode', () => {
        render(<EntryVisibilityControls isEditMode={false} onEnter={noop} onSave={noop} onCancel={noop} />, {
            wrapper: Wrapper,
        });

        expect(screen.getByRole('button', { name: 'Manage visibility' })).toBeInTheDocument();
    });
});
