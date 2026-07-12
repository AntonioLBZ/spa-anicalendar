import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

import '@testing-library/jest-dom/vitest';

// `globals: false` in vitest.config.ts means RTL's automatic per-test cleanup
// (which detects a global `afterEach`) never registers — do it explicitly.
afterEach(() => {
    cleanup();
});

// react-aria-components relies on PointerEvent and matchMedia, which jsdom
// doesn't fully implement. Polyfill the minimum surface needed for press/focus
// interactions to work under jsdom in tests.
if (typeof window.PointerEvent === 'undefined') {
    class PointerEventPolyfill extends MouseEvent {
        pointerId: number;
        pointerType: string;
        width: number;
        height: number;
        pressure: number;
        tangentialPressure: number;
        tiltX: number;
        tiltY: number;
        twist: number;
        isPrimary: boolean;

        constructor(type: string, params: PointerEventInit = {}) {
            super(type, params);
            this.pointerId = params.pointerId ?? 0;
            this.pointerType = params.pointerType ?? 'mouse';
            this.width = params.width ?? 1;
            this.height = params.height ?? 1;
            this.pressure = params.pressure ?? 0;
            this.tangentialPressure = params.tangentialPressure ?? 0;
            this.tiltX = params.tiltX ?? 0;
            this.tiltY = params.tiltY ?? 0;
            this.twist = params.twist ?? 0;
            this.isPrimary = params.isPrimary ?? false;
        }
    }

    // @ts-expect-error jsdom has no native PointerEvent implementation
    window.PointerEvent = PointerEventPolyfill;
}

if (typeof window.matchMedia === 'undefined') {
    window.matchMedia = (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
    });
}

if (typeof window.ResizeObserver === 'undefined') {
    class ResizeObserverPolyfill {
        observe() {}
        unobserve() {}
        disconnect() {}
    }

    window.ResizeObserver = ResizeObserverPolyfill;
}
