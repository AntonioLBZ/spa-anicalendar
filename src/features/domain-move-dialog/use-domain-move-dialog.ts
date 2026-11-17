'use client';

import { useState, useSyncExternalStore } from 'react';

import { buildMigrationUrl, CANONICAL_HOST, isLegacyHost } from '@/lib/site-migration';

const isInstalledApp = () =>
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;

const readStorage = () => {
    try {
        return window.localStorage;
    } catch {
        return null;
    }
};

const subscribeNever = () => () => {};
const serverFalse = () => false;

const useDomainMoveDialog = () => {
    // Host and display mode are only known in the browser: false during SSR and hydration
    const isLegacy = useSyncExternalStore(subscribeNever, () => isLegacyHost(window.location.host), serverFalse);
    const isInstalled = useSyncExternalStore(subscribeNever, isInstalledApp, serverFalse);
    const [isDismissed, setIsDismissed] = useState(false);

    const setIsOpen = (open: boolean) => setIsDismissed(!open);

    const moveNow = () => {
        window.location.assign(buildMigrationUrl(window.location, readStorage()));
    };

    return {
        state: { isOpen: isLegacy && !isDismissed, isInstalled },
        data: { newHost: CANONICAL_HOST },
        actions: { setIsOpen, moveNow },
    };
};

export { useDomainMoveDialog };
