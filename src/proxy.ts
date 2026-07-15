import createMiddleware from 'next-intl/middleware';

import { routing } from './lib/i18n/routing';

const proxy = createMiddleware(routing);

export default proxy;

export const config = {
    matcher: ['/((?!api|_next|.*\\..*).*)'],
};
