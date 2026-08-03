import { cookies, headers } from 'next/headers';

import { BRAND_BACKGROUND } from '@/lib/brand';
import { routing } from '@/lib/i18n/routing';

import type { MetadataRoute } from 'next';

// PWA start_url must resolve without a redirect (Chrome's installability check), so we can't
const resolveStartLocale = async () => {
    const cookieLocale = (await cookies()).get('NEXT_LOCALE')?.value;
    if (routing.locales.includes(cookieLocale as (typeof routing.locales)[number])) return cookieLocale!;

    const acceptLanguage = (await headers()).get('accept-language') ?? '';
    const preferred = acceptLanguage.split(',')[0]?.split('-')[0]?.toLowerCase();
    if (routing.locales.includes(preferred as (typeof routing.locales)[number])) return preferred!;

    return routing.defaultLocale;
};

const manifest = async (): Promise<MetadataRoute.Manifest> => ({
    name: 'Anicalendar',
    short_name: 'Anicalendar',
    description: 'Weekly anime calendar powered by AniList, MyAnimeList and Kitsu.',
    start_url: `/${await resolveStartLocale()}`,
    display: 'standalone',
    background_color: BRAND_BACKGROUND,
    theme_color: BRAND_BACKGROUND,
    icons: [
        { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: '/icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
});

export default manifest;
