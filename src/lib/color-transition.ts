/** CSS time to milliseconds; the production CSS minifier rewrites `300ms` as `.3s`. */
const toMilliseconds = (time: string) => {
    const amount = parseFloat(time);
    if (Number.isNaN(amount)) return 0;
    return time.trim().endsWith('ms') ? amount : amount * 1000;
};

/** Pending removal of the fade flag; a quick second change restarts the window instead of cutting it short. */
let clearTimer: number | undefined;

/**
 * Runs a state update that recolors the whole page (theme, color scheme) with `data-color-transition` on
 * <html>, so colors fade instead of snapping (see `themes.css`). Not a View Transition: that makes the page
 * inert while it runs, and in Chromium a click mid-fade lands on <html> and dismisses the open drawer.
 * The fade lasts `--duration-slow`, which is 0 under reduced motion, so the update then applies directly.
 */
const withColorTransition = (update: () => void) => {
    if (typeof document === 'undefined') {
        update();
        return;
    }

    const root = document.documentElement;
    const fadeMs = toMilliseconds(getComputedStyle(root).getPropertyValue('--duration-slow'));

    if (fadeMs === 0) {
        update();
        return;
    }

    root.dataset.colorTransition = '';
    update();

    window.clearTimeout(clearTimer);
    clearTimer = window.setTimeout(() => delete root.dataset.colorTransition, fadeMs);
};

export { withColorTransition };
