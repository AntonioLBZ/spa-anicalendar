import { afterEach, describe, expect, it, vi } from 'vitest';

import { withViewTransition } from '../view-transition';

afterEach(() => {
    vi.restoreAllMocks();
    // @ts-expect-error cleaning up the stub added below
    delete document.startViewTransition;
});

describe('withViewTransition', () => {
    it('applies the update directly when the View Transitions API is unavailable', () => {
        const update = vi.fn();

        withViewTransition(update);

        expect(update).toHaveBeenCalledOnce();
    });

    it('runs the update inside a view transition when available', () => {
        const update = vi.fn();
        const startViewTransition = vi.fn((callback: () => void) => callback());
        document.startViewTransition = startViewTransition as unknown as typeof document.startViewTransition;

        withViewTransition(update);

        expect(startViewTransition).toHaveBeenCalledOnce();
        expect(update).toHaveBeenCalledOnce();
    });

    it('skips the transition when the user prefers reduced motion', () => {
        const update = vi.fn();
        const startViewTransition = vi.fn();
        document.startViewTransition = startViewTransition as unknown as typeof document.startViewTransition;
        vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true } as MediaQueryList);

        withViewTransition(update);

        expect(startViewTransition).not.toHaveBeenCalled();
        expect(update).toHaveBeenCalledOnce();
    });
});
