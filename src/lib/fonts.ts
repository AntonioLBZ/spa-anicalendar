import { Inter, Overpass } from 'next/font/google';

// TODO(i18n-ja): CJK font family (next/font, loaded per-locale) needed here when 'ja' is added to locales
// Variable fonts; only Latin is preloaded, other scripts (romaji macrons in latin-ext) load on first use
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

// AniList's typeface, for the brand, titles and the home headline
const overpass = Overpass({ subsets: ['latin'], variable: '--font-overpass', display: 'swap' });

export { inter, overpass };
