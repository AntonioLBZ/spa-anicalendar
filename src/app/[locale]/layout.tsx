import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Suspense, type ReactNode } from 'react';

import { Footer } from '@/features/footer';
import { Header } from '@/features/header';
import { inter } from '@/lib/fonts';
import { routing } from '@/lib/i18n/routing';

import { Providers } from '../providers';

import type { Metadata } from 'next';

import '@/assets/themes.css';
import '@/assets/typography.css';
import './layout.css';

const generateStaticParams = () => routing.locales.map((locale) => ({ locale }));

const generateMetadata = async (props: { params: Promise<{ locale: string }> }): Promise<Metadata> => {
    const { locale } = await props.params;
    const t = await getTranslations({ locale, namespace: 'metadata' });

    return {
        title: t('title'),
        description: t('description'),
    };
};

export default async function LocaleLayout(props: { children: ReactNode; params: Promise<{ locale: string }> }) {
    const { children, params } = props;
    const { locale } = await params;

    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    setRequestLocale(locale);

    return (
        // <body> is rendered inside <Providers> (see ThemedBody in providers.tsx)
        <html lang={locale} className={inter.variable}>
            <NextIntlClientProvider>
                <Providers>
                    <Header />
                    {children}
                    <Footer />
                    <Analytics />
                    <SpeedInsights />
                </Providers>
            </NextIntlClientProvider>
        </html>
    );
}

export { generateStaticParams, generateMetadata };
