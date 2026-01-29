import type { Metadata } from 'next';
import { Providers } from './providers';

import '@/assets/fonts/fonts.css';
import '@/themes.css';
import '@/App.css';

export const metadata: Metadata = {
    title: 'Anicalendar',
    description: 'Calendar application',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head />
            <Providers>{children}</Providers>
        </html>
    );
}

export { useThemeContext } from './providers';
