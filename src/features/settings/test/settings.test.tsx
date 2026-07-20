import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { SettingsProvider } from '@/contexts';
import { MemoryStorage } from '@/lib/test/memory-storage';

import { Settings } from '../settings';

import type { ReactNode } from 'react';

const messages = {
    settings: {
        trigger: 'Settings',
        sections: {
            theme: 'Theme',
            content: 'Content',
            layout: 'Layout',
            emptyDays: 'Empty Days',
            weekStart: 'Week Start',
            timeFormat: 'Time Format',
            help: 'Help',
        },
        theme: { system: 'System', dark: 'Dark', light: 'Light' },
        content: { sfw: 'SFW', plus16: '+16', plus18: '+18' },
        layout: { grid: 'Horizontal', vertical: 'List' },
        emptyDays: { show: 'Show', hide: 'Hide' },
        weekStart: { monday: 'Mon', sunday: 'Sun' },
        timeFormat: { '24h': '24h', '12h': '12h' },
        issueText: 'Any issue? Click <link>here</link>',
    },
};

const Wrapper = (props: { children: ReactNode }) => (
    <NextIntlClientProvider locale="en" messages={messages}>
        <SettingsProvider>{props.children}</SettingsProvider>
    </NextIntlClientProvider>
);

const STORAGE_KEY = 'anicalendar-settings';

const memoryStorage = new MemoryStorage();

beforeEach(() => {
    vi.stubGlobal('localStorage', memoryStorage);
    memoryStorage.clear();
});

afterEach(() => {
    vi.unstubAllGlobals();
});

// GOTCHA: switching Settings from RAC Popover (non-modal) to Modal (via Drawer) activates
// RAC's ariaHideOutside, which sets aria-hidden on sibling DOM (including the trigger button)
// while the drawer is open. So the trigger must be read from `screen` BEFORE opening, and once
// open, all content assertions must be scoped with within(screen.getByRole('dialog')) instead
// of querying the unscoped `screen`/`document.body`.
const openSettings = async (user: ReturnType<typeof userEvent.setup>) => {
    render(<Settings />, { wrapper: Wrapper });
    const trigger = screen.getByRole('button', { name: 'Settings' });
    await user.click(trigger);
    return within(await screen.findByRole('dialog'));
};

describe('Settings', () => {
    it('renders a Layout section with Horizontal and List options', async () => {
        const user = userEvent.setup();
        const dialog = await openSettings(user);

        const group = await dialog.findByRole('radiogroup', { name: 'Layout' });
        expect(group).toBeInTheDocument();
        expect(dialog.getByRole('radio', { name: 'Horizontal' })).toBeInTheDocument();
        expect(dialog.getByRole('radio', { name: 'List' })).toBeInTheDocument();
    });

    it('updates calendarLayout in storage when a Layout option is clicked', async () => {
        const user = userEvent.setup();
        const dialog = await openSettings(user);

        const listOption = await dialog.findByRole('radio', { name: 'List' });
        await user.click(listOption);

        await waitFor(() => {
            const stored = JSON.parse(memoryStorage.getItem(STORAGE_KEY) ?? '{}');
            expect(stored.calendarLayout).toBe('vertical');
        });
        expect(listOption).toBeChecked();
    });

    it('no longer offers a "Min" option in the Empty Days section', async () => {
        const user = userEvent.setup();
        const dialog = await openSettings(user);

        await dialog.findByRole('radiogroup', { name: 'Empty Days' });
        expect(dialog.getByRole('radio', { name: 'Show' })).toBeInTheDocument();
        expect(dialog.getByRole('radio', { name: 'Hide' })).toBeInTheDocument();
        expect(dialog.queryByRole('radio', { name: 'Min' })).not.toBeInTheDocument();
    });

    it('closes on Escape', async () => {
        const user = userEvent.setup();
        await openSettings(user);

        expect(screen.getByRole('dialog')).toBeInTheDocument();

        await user.keyboard('{Escape}');

        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
    });
});
