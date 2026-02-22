'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

import { AiringView } from '@/modules/airing-view';

export default function AiringPage() {
    return (
        <Suspense fallback={null}>
            <AiringContent />
        </Suspense>
    );
}

function AiringContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const userName = searchParams.get('user');

    if (!userName) {
        router.push('/');
        return null;
    }

    return <AiringView userName={userName} />;
}
