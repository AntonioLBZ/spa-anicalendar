import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useUserContext } from '@/contexts/user-context';
import { getMediaList, getUserByName } from '@/services';

import type { AnimeEntry, GetMediaListParams, User } from '@/services';

const useAiringData = (userName: string | null) => {
    const router = useRouter();
    const [userData, setUserData] = useState<User | null>(null);
    const [entries, setEntries] = useState<AnimeEntry[]>([]);
    const [error, setError] = useState<string | null>(null);
    const { setUser } = useUserContext();

    useEffect(() => {
        if (!userName?.trim()) {
            router.push('/');
            return;
        }

        let cancelled = false;

        getUserByName(userName)
            .then((data) => {
                if (!cancelled) {
                    setUserData(data);
                    setUser?.(data);
                }
            })
            .catch((err) => {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : 'Failed to fetch user');
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

    return { entries, error };
};

export { useAiringData };
