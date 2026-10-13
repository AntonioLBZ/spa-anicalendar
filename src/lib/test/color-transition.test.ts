import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { withColorTransition } from '../color-transition';

const root = document.documentElement;

beforeEach(() => {
    vi.useFakeTimers();
});

afterEach(() => {
    vi.useRealTimers();
    root.style.removeProperty('--duration-slow');
    delete root.dataset.colorTransition;
});

describe('withColorTransition', () => {
    it('flags <html> while the new colors fade in, then clears the flag', () => {
        root.style.setProperty('--duration-slow', '300ms');
        const update = vi.fn(() => expect(root.dataset.colorTransition).toBe(''));

        withColorTransition(update);

        expect(update).toHaveBeenCalledOnce();
        vi.advanceTimersByTime(299);
        expect(root.dataset.colorTransition).toBe('');
        vi.advanceTimersByTime(1);
        expect(root.dataset.colorTransition).toBeUndefined();
    });

    it('keeps the flag for a full fade after a quick second change', () => {
        root.style.setProperty('--duration-slow', '300ms');

        withColorTransition(vi.fn());
        vi.advanceTimersByTime(200);
        withColorTransition(vi.fn());
        vi.advanceTimersByTime(200);

        expect(root.dataset.colorTransition).toBe('');
        vi.advanceTimersByTime(100);
        expect(root.dataset.colorTransition).toBeUndefined();
    });

    it('reads the fade duration in seconds too, as the minified CSS writes it', () => {
        root.style.setProperty('--duration-slow', '.3s');

        withColorTransition(vi.fn());
        vi.advanceTimersByTime(299);

        expect(root.dataset.colorTransition).toBe('');
        vi.advanceTimersByTime(1);
        expect(root.dataset.colorTransition).toBeUndefined();
    });

    it('applies the update directly when motion is reduced', () => {
        root.style.setProperty('--duration-slow', '0ms');
        const update = vi.fn(() => expect(root.dataset.colorTransition).toBeUndefined());

        withColorTransition(update);

        expect(update).toHaveBeenCalledOnce();
    });
});
