import createMiddleware from 'next-intl/middleware';

import { routing } from './lib/i18n/routing';
import { CANONICAL_ORIGIN, isLegacyHost } from './lib/site-migration';

import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

const proxy = (request: NextRequest) => {
    const response = intlMiddleware(request);

    // Points search engines at the new domain while the old one still serves the app
    if (isLegacyHost(request.headers.get('host') ?? '')) {
        const canonical = `<${new URL(request.nextUrl.pathname, CANONICAL_ORIGIN)}>; rel="canonical"`;
        const link = response.headers.get('link');
        response.headers.set('link', link ? `${link}, ${canonical}` : canonical);
    }

    return response;
};

export default proxy;

// The UUID segment is BotID's challenge proxy (rewritten by `withBotId`), which must not get a locale prefix
export const config = {
    matcher: ['/((?!api|_next|149e9513-01fa-4fb0-aad4-566afd725d1b|.*\\..*).*)'],
};
