import { QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode } from 'react';

import { Body } from '@/components/body/body';
import { AppHeader } from '@/features/app-header';
import { inter } from '@/lib/fonts';

import type { Metadata } from 'next';
import '@/assets/themes.css';
import '@/assets/typography.css';

export const metadata: Metadata = {
    title: 'Anicalendar',
    description: 'Weekly anime calendar powered by AniList',
};

export default function LayoutRoot(props: { children: ReactNode }) {
    const { children } = props;

    return (
        <html lang="en" className={inter.variable}>
            <Body>
                <AppHeader />
                {children}
            </Body>
        </html>
    );
}
