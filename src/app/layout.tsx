import { AppBody } from '@/features/app-body';
import { AppHeader } from '@/features/app-header';

import type { Metadata } from 'next';
import type { ReactNode } from 'react';

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
        <html lang="en">
            <body>
                <AppBody>
                    <AppHeader />
                    {children}
                </AppBody>
            </body>
        </html>
    );
}
