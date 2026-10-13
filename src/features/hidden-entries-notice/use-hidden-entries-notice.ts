'use client';

import { useCallback, useEffect, useSyncExternalStore } from 'react';

import { createPersistedStore } from '@/lib/create-persisted-store';

import type { HiddenEntriesNoticeProps } from './hidden-entries-notice.types';

const STORAGE_KEY = 'anicalendar-dismissed-hidden-notices';

// scope → signature of the reasons that were showing when the notice was dismissed
const dismissedStore = createPersistedStore<Record<string, string>>(STORAGE_KEY, {});

type HiddenReason = 'content' | 'manual' | 'listFilters';

const REASONS: HiddenReason[] = ['content', 'manual', 'listFilters'];

const useHiddenEntriesNotice = (props: HiddenEntriesNoticeProps) => {
    const { scope, counts, contentFilter } = props;

    const dismissed = useSyncExternalStore(
        dismissedStore.subscribe,
        dismissedStore.getSnapshot,
        dismissedStore.getServerSnapshot
    );

    useEffect(() => {
        dismissedStore.hydrate();
    }, []);

    const reasons = REASONS.filter((reason) => counts[reason] > 0);
    const total = reasons.reduce((sum, reason) => sum + counts[reason], 0);

    // Counts change as the schedule updates; only a new reason (or a different content filter) re-shows a dismissed notice.
    const signature = reasons.map((reason) => (reason === 'content' ? `content:${contentFilter}` : reason)).join('|');

    const dismiss = useCallback(
        () => dismissedStore.set((prev) => ({ ...prev, [scope]: signature })),
        [scope, signature]
    );

    return {
        state: {
            isVisible: total > 0 && dismissed[scope] !== signature,
        },
        data: {
            total,
            reasons,
        },
        actions: {
            dismiss,
        },
    };
};

export { useHiddenEntriesNotice };
export type { HiddenReason };
