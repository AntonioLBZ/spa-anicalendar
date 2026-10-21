import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { IntlTestWrapper as Wrapper } from '@/lib/test/intl-wrapper';
import { MemoryStorage } from '@/lib/test/memory-storage';

import { HiddenEntriesNotice } from '../hidden-entries-notice';

import type { HiddenEntriesCounts } from '../hidden-entries-notice.types';

const STORAGE_KEY = 'anicalendar-dismissed-hidden-notices';
const memoryStorage = new MemoryStorage();

const NONE: HiddenEntriesCounts = { content: 0, manual: 0, listFilters: 0 };

beforeEach(() => {
    vi.stubGlobal('localStorage', memoryStorage);
    memoryStorage.clear();
});

afterEach(() => {
    vi.unstubAllGlobals();
});

// The dismissal store is module-level, so each test uses its own scope to stay independent.
describe('HiddenEntriesNotice', () => {
    it('summarises the total and each reason, naming the active content filter', () => {
        render(
            <HiddenEntriesNotice scope="t1" contentFilter="sfw" counts={{ content: 3, manual: 1, listFilters: 2 }} />,
            { wrapper: Wrapper }
        );

        expect(screen.getByText(/6 anime are hidden by your visibility settings/)).toBeInTheDocument();
        expect(
            screen.getByText(
                /3 by the SFW content filter, 1 hidden manually, and 2 by the format or new-season filters\./
            )
        ).toBeInTheDocument();
    });

    it('lists only the reasons that hide something', () => {
        render(<HiddenEntriesNotice scope="t2" contentFilter="plus16" counts={{ ...NONE, content: 1 }} />, {
            wrapper: Wrapper,
        });

        expect(screen.getByText(/1 anime is hidden by your visibility settings/)).toBeInTheDocument();
        expect(screen.getByText(/1 by the \+16 content filter\./)).toBeInTheDocument();
        expect(screen.queryByText(/manually/)).not.toBeInTheDocument();
    });

    it('renders nothing when nothing is hidden', () => {
        const { container } = render(<HiddenEntriesNotice scope="t3" contentFilter="sfw" counts={NONE} />, {
            wrapper: Wrapper,
        });

        expect(container).toBeEmptyDOMElement();
    });

    it('stays dismissed while the reasons are the same, even if the counts change', async () => {
        const user = userEvent.setup();
        const { rerender } = render(
            <HiddenEntriesNotice scope="t4" contentFilter="sfw" counts={{ ...NONE, content: 2 }} />,
            { wrapper: Wrapper }
        );

        await user.click(screen.getByRole('button', { name: 'Dismiss notice' }));

        await waitFor(() => {
            expect(screen.queryByRole('button', { name: 'Dismiss notice' })).not.toBeInTheDocument();
        });
        expect(JSON.parse(memoryStorage.getItem(STORAGE_KEY) ?? '{}')).toEqual({ t4: 'content:sfw' });

        rerender(<HiddenEntriesNotice scope="t4" contentFilter="sfw" counts={{ ...NONE, content: 5 }} />);
        expect(screen.queryByRole('button', { name: 'Dismiss notice' })).not.toBeInTheDocument();
    });

    it('shows again when a new reason appears or the content filter changes', async () => {
        const user = userEvent.setup();
        const { rerender } = render(
            <HiddenEntriesNotice scope="t5" contentFilter="sfw" counts={{ ...NONE, content: 2 }} />,
            { wrapper: Wrapper }
        );
        await user.click(screen.getByRole('button', { name: 'Dismiss notice' }));

        rerender(<HiddenEntriesNotice scope="t5" contentFilter="sfw" counts={{ ...NONE, content: 2, manual: 1 }} />);
        expect(screen.getByRole('button', { name: 'Dismiss notice' })).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Dismiss notice' }));
        rerender(<HiddenEntriesNotice scope="t5" contentFilter="plus16" counts={{ ...NONE, content: 1, manual: 1 }} />);
        expect(screen.getByRole('button', { name: 'Dismiss notice' })).toBeInTheDocument();
    });

    it('keeps dismissals per scope', async () => {
        const user = userEvent.setup();
        const counts = { ...NONE, manual: 1 };
        const { rerender } = render(<HiddenEntriesNotice scope="t6-a" contentFilter="sfw" counts={counts} />, {
            wrapper: Wrapper,
        });
        await user.click(screen.getByRole('button', { name: 'Dismiss notice' }));

        rerender(<HiddenEntriesNotice scope="t6-b" contentFilter="sfw" counts={counts} />);
        expect(screen.getByRole('button', { name: 'Dismiss notice' })).toBeInTheDocument();
    });
});
