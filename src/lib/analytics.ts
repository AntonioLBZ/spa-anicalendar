import { track } from '@vercel/analytics';

import type { Provider } from '@/services';

/**
 * Typed wrappers around Vercel Analytics custom events.
 * Each helper is a no-op unless the app runs on a Vercel deployment.
 */
const analytics = {
    search: (provider: Provider) => track('search', { provider }),
    airingLoaded: (provider: Provider, count: number) => track('airing_loaded', { provider, count }),
    airingError: (provider: Provider) => track('airing_error', { provider }),
};

export { analytics };
