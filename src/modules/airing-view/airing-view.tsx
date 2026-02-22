'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import { useUserContext } from '@/modules/user-context';
import { UserProfile } from '@/modules/user-profile';
import { WeeklyCalendar } from '@/modules/weekly-calendar';
import {
    UserData,
    MediaListEntry,
    getMediaList,
    GetMediaListParams,
} from '@/platform/services/api';
import { fetchUser } from '@/platform/services/fetchUser';

import type { AiringViewProps } from './airing-view.types';

const AiringView = (props: AiringViewProps) => {
    const { userName } = props;
    const [userData, setUserData] = useState<UserData | null>(null);
    const [entries, setEntries] = useState<MediaListEntry[]>([]);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { setUser } = useUserContext();

    useEffect(() => {
        if (!userName.trim()) {
            router.push('/');
            return;
        }

        let cancelled = false;

        fetchUser(userName)
            .then((data) => {
                if (!cancelled) {
                    setUserData(data);
                    setUser?.(data);
                }
            })
            .catch((err) => {
                if (!cancelled) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : 'Failed to fetch user'
                    );
                }
            });

        return () => {
            cancelled = true;
        };
    }, [userName, setUser, router]);

    useEffect(() => {
        if (!userData?.id) return;

        let cancelled = false;

        const params: GetMediaListParams = {
            userId: userData.id,
            type: 'ANIME',
            statusIn: ['CURRENT', 'REPEATING'],
        };

        getMediaList(params)
            .then((data) => {
                if (!cancelled) setEntries(data);
            })
            .catch(() => {
                if (!cancelled) setEntries([]);
            });

        return () => {
            cancelled = true;
        };
    }, [userData?.id]);

    if (error) {
        return (
            <main>
                <p>Error: {error}</p>
            </main>
        );
    }

    return (
        <main>
            <UserProfile userData={userData} />
            <WeeklyCalendar entries={entries} />
        </main>
    );
};

export { AiringView };
