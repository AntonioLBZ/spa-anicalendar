import { flushSync } from 'react-dom';

/**
 * Runs a state update that restyles the whole page (theme, color scheme) inside a View Transition, so the
 * change cross-fades instead of snapping. Falls back to a plain update when the API is unavailable or the
 * user prefers reduced motion. `flushSync` makes React commit the new DOM before the "after" snapshot.
 */
const withViewTransition = (update: () => void) => {
    const canTransition =
        typeof document !== 'undefined' &&
        typeof document.startViewTransition === 'function' &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!canTransition) {
        update();
        return;
    }

    document.startViewTransition(() => flushSync(update));
};

export { withViewTransition };
