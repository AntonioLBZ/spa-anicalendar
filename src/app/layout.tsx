import type { ReactNode } from 'react';

export default function RootLayout(props: { children: ReactNode }) {
    const { children } = props;

    return children;
}
