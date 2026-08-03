import { BRAND_BACKGROUND } from '@/lib/brand';

import type { MetadataRoute } from 'next';

const manifest = (): MetadataRoute.Manifest => ({
    name: 'Anicalendar',
    short_name: 'Anicalendar',
    description: 'Weekly anime calendar powered by AniList, MyAnimeList and Kitsu.',
    start_url: '/',
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
