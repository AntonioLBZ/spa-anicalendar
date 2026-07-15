import { defineRouting } from 'next-intl/routing';

const routing = defineRouting({
    locales: ['en', 'es'],
    defaultLocale: 'en',
    localePrefix: 'always',
});

export { routing };
