'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import { WeeklyCalendar } from '@/features/weekly-calendar';

import { useAiringData } from './use-airing-data';

export default function AiringPage() {
    return (
        <Suspense fallback={null}>
            <AiringContent />
        </Suspense>
    );
}

function AiringContent() {
    const searchParams = useSearchParams();
    const userName = searchParams.get('user');
    const { entries, error } = useAiringData(userName);

    if (error) {
        return (
            <main>
                <p>Error: {error}</p>
            </main>
        );
    }

    return (
        <main>
            <WeeklyCalendar entries={entries} />
        </main>
    );
}
