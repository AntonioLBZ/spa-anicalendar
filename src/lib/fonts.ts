import localFont from 'next/font/local';

// TODO(i18n-ja): CJK font family (next/font, loaded per-locale) needed here when 'ja' is added to locales
const inter = localFont({
    src: [
        { path: '../assets/fonts/Inter_18pt-Regular.ttf', weight: '400', style: 'normal' },
        { path: '../assets/fonts/Inter_18pt-Italic.ttf', weight: '400', style: 'italic' },
        { path: '../assets/fonts/Inter_18pt-SemiBold.ttf', weight: '600', style: 'normal' },
        { path: '../assets/fonts/Inter_18pt-SemiBoldItalic.ttf', weight: '600', style: 'italic' },
        { path: '../assets/fonts/Inter_18pt-Bold.ttf', weight: '700', style: 'normal' },
        { path: '../assets/fonts/Inter_18pt-BoldItalic.ttf', weight: '700', style: 'italic' },
    ],
    variable: '--font-inter',
    display: 'swap',
});

export { inter };
