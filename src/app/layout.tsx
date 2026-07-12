import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { type ReactNode } from 'react';

import { Header } from '@/features/header';
import { inter } from '@/lib/fonts';

import { Providers } from './providers';

import type { Metadata } from 'next';

import '@/assets/themes.css';
import '@/assets/typography.css';
import './layout.css';

export const metadata: Metadata = {
    title: 'Anicalendar',
    description: 'Weekly anime calendar powered by AniList', // TODO cabmbiar esto
};

export default function LayoutRoot(props: { children: ReactNode }) {
    const { children } = props;

    return (
        <html lang="en" className={inter.variable}>
            <Providers>
                <Header />
                {children}
                <Analytics />
                <SpeedInsights />
            </Providers>
        </html>
    );
}
