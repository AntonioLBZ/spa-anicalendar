import createMiddleware from 'next-intl/middleware';

import { routing } from './lib/i18n/routing';

const proxy = createMiddleware(routing);

export default proxy;

// The UUID segment is BotID's challenge proxy (rewritten by `withBotId`), which must not get a locale prefix
export const config = {
    matcher: ['/((?!api|_next|149e9513-01fa-4fb0-aad4-566afd725d1b|.*\\..*).*)'],
};
