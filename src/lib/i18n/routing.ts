import { defineRouting } from 'next-intl/routing';

const routing = defineRouting({
    locales: ['en', 'es', 'fr', 'de'],
    defaultLocale: 'en',
    localePrefix: 'always',
});

export { routing };
