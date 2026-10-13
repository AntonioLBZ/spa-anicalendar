import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { SettingsProvider } from '@/contexts';
import { IntlTestWrapper } from '@/lib/test/intl-wrapper';
import { MemoryStorage } from '@/lib/test/memory-storage';

import { Settings } from '../settings';

import type { ReactNode } from 'react';

const Wrapper = (props: { children: ReactNode }) => (
    <IntlTestWrapper>
        <SettingsProvider>{props.children}</SettingsProvider>
    </IntlTestWrapper>
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

const openSettings = async (user: ReturnType<typeof userEvent.setup>) => {
    render(<Settings />, { wrapper: Wrapper });
    const trigger = screen.getByRole('button', { name: 'Settings' });
    await user.click(trigger);
    return within(await screen.findByRole('dialog'));
};

describe('Settings', () => {
    it('renders a Layout section with Auto, Grid and List options', async () => {
        const user = userEvent.setup();
        const dialog = await openSettings(user);

        const group = await dialog.findByRole('radiogroup', { name: 'Layout' });
        expect(group).toBeInTheDocument();
        expect(dialog.getByRole('radio', { name: 'Auto' })).toBeChecked();
        expect(dialog.getByRole('radio', { name: 'Grid' })).toBeInTheDocument();
        expect(dialog.getByRole('radio', { name: 'List' })).toBeInTheDocument();
    });

    it('updates calendarLayout in storage when a Layout option is clicked', async () => {
        const user = userEvent.setup();
        const dialog = await openSettings(user);

        const listOption = await dialog.findByRole('radio', { name: 'List' });
        await user.click(listOption);

        await waitFor(() => {
            const stored = JSON.parse(memoryStorage.getItem(STORAGE_KEY) ?? '{}');
            expect(stored.calendarLayout).toBe('list');
        });
        expect(listOption).toBeChecked();
    });

    it('renders the Accent color options with Default selected', async () => {
        const user = userEvent.setup();
        const dialog = await openSettings(user);

        const group = await dialog.findByRole('radiogroup', { name: 'Accent color' });
        const options = within(group).getAllByRole('radio');
        expect(options).toHaveLength(8);
        expect(dialog.getByRole('radio', { name: 'Default' })).toBeChecked();
        expect(dialog.getByRole('radio', { name: 'AniList' })).not.toBeChecked();
    });

    it('updates accentColor in storage when an Accent color option is clicked', async () => {
        const user = userEvent.setup();
        const dialog = await openSettings(user);

        const purpleOption = await dialog.findByRole('radio', { name: 'Purple' });
        await user.click(purpleOption);

        await waitFor(() => {
            const stored = JSON.parse(memoryStorage.getItem(STORAGE_KEY) ?? '{}');
            expect(stored.accentColor).toBe('purple');
        });
        expect(purpleOption).toBeChecked();
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
