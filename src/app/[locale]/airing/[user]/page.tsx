'use client';

import { useParams } from 'next/navigation';

import { WeeklyCalendar } from '@/features/weekly-calendar';

import { useAiringData } from './use-airing-data';

import './page.css';

export default function AiringPage() {
    const params = useParams<{ user: string }>();
    const rawUser = Array.isArray(params.user) ? params.user[0] : params.user;
    const userName = rawUser ? decodeURIComponent(rawUser) : null;

    const { entries, error } = useAiringData(userName);

    if (error) {
        return null;
    }

    return (
        <main className="airing-page">
            <div className="airing-page__content">
                <WeeklyCalendar entries={entries} />
            </div>
        </main>
    );
}
