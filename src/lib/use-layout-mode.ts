'use client';

import { useSyncExternalStore } from 'react';

import { BREAKPOINTS } from './breakpoints';

type LayoutMode = 'mobile' | 'tablet' | 'desktop';

const getLayoutMode = (): LayoutMode => {
    if (typeof window === 'undefined') return 'desktop';

    const width = window.innerWidth;
    if (width <= BREAKPOINTS.mobile) return 'mobile';
    if (width <= BREAKPOINTS.tablet) return 'tablet';
    return 'desktop';
};

const subscribe = (callback: () => void) => {
    window.addEventListener('resize', callback);
    return () => window.removeEventListener('resize', callback);
};

const useLayoutMode = (): LayoutMode => {
    return useSyncExternalStore(subscribe, getLayoutMode, () => 'desktop');
};

export { useLayoutMode };
export type { LayoutMode };
