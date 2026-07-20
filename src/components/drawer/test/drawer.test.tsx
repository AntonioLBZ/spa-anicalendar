import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Drawer } from '..';

const renderDrawer = (onOpenChange?: (isOpen: boolean) => void) =>
    render(
        <Drawer>
            <Drawer.Trigger aria-label="Open filters">Open</Drawer.Trigger>
            <Drawer.Panel onOpenChange={onOpenChange} closeButtonLabel="Close">
                <p>Panel content</p>
            </Drawer.Panel>
        </Drawer>
    );

describe('Drawer', () => {
    it('exposes an accessible name on the trigger', () => {
        renderDrawer();
        expect(screen.getByRole('button', { name: 'Open filters' })).toBeInTheDocument();
    });

    it('opens the panel and renders its content', async () => {
        const user = userEvent.setup();
        renderDrawer();

        await user.click(screen.getByRole('button', { name: 'Open filters' }));

        const dialog = await screen.findByRole('dialog');
        expect(within(dialog).getByText('Panel content')).toBeInTheDocument();
    });

    it('dismisses on Escape and fires onOpenChange(false)', async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();
        renderDrawer(onOpenChange);

        await user.click(screen.getByRole('button', { name: 'Open filters' }));
        await screen.findByRole('dialog');

        await user.keyboard('{Escape}');

        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('dismisses on backdrop click and fires onOpenChange(false)', async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();
        const { container } = renderDrawer(onOpenChange);

        await user.click(screen.getByRole('button', { name: 'Open filters' }));
        await screen.findByRole('dialog');

        const overlay = container.ownerDocument.querySelector('.drawer__overlay');
        expect(overlay).not.toBeNull();
        await user.click(overlay as Element);

        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('dismisses on close-button click and fires onOpenChange(false)', async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();
        renderDrawer(onOpenChange);

        await user.click(screen.getByRole('button', { name: 'Open filters' }));
        const dialog = await screen.findByRole('dialog');

        await user.click(within(dialog).getByRole('button', { name: 'Close' }));

        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
        expect(onOpenChange).toHaveBeenCalledWith(false);
    });
});
