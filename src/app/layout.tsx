import { QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode } from 'react';

import { Body } from '@/features/app-body';
import { AppHeader } from '@/features/app-header';
import { inter } from '@/lib/fonts';

import { SettingsProvider, UserContextProvider } from '../contexts';
import { queryClient } from '../lib/query-client';

import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Anicalendar',
    description: 'Weekly anime calendar powered by AniList',
};

type LayoutRootProps = {
    children: ReactNode;
};

export default function LayoutRoot(props: LayoutRootProps) {
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
