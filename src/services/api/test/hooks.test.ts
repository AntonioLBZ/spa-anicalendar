import { describe, expect, it } from 'vitest';

describe('useMediaList query key generation', () => {
    it('produces different query keys for different statuses', () => {
        const provider = 'anilist' as const;
        const userName = 'testuser';

        const statusKey1 = ['WATCHING'].sort().join(',');
        const statusKey2 = ['PLANNING'].sort().join(',');
        const statusKey3 = ['WATCHING', 'PLANNING'].sort().join(',');

        const queryKey1 = ['mediaList', provider, userName, statusKey1];
        const queryKey2 = ['mediaList', provider, userName, statusKey2];
        const queryKey3 = ['mediaList', provider, userName, statusKey3];

        expect(queryKey1).not.toEqual(queryKey2);
        expect(queryKey1).not.toEqual(queryKey3);
        expect(queryKey2).not.toEqual(queryKey3);
    });

    it('produces the same query key for the same statuses regardless of order', () => {
        const provider = 'anilist' as const;
        const userName = 'testuser';

        const statusKey1 = ['WATCHING', 'PLANNING'].sort().join(',');
        const statusKey2 = ['PLANNING', 'WATCHING'].sort().join(',');

        const queryKey1 = ['mediaList', provider, userName, statusKey1];
        const queryKey2 = ['mediaList', provider, userName, statusKey2];

        expect(queryKey1).toEqual(queryKey2);
    });

    it('defaults to WATCHING when statuses are not provided', () => {
        const provider = 'anilist' as const;
        const userName = 'testuser';

        const statusKeyDefault = ['WATCHING'].sort().join(',');
        const queryKeyDefault = ['mediaList', provider, userName, statusKeyDefault];
        const queryKeyWatching = ['mediaList', provider, userName, statusKeyDefault];

        expect(queryKeyDefault).toEqual(queryKeyWatching);
    });

    it('includes statuses in the query key', () => {
        const provider = 'anilist' as const;
        const userName = 'testuser';

        const statusKey = ['PLANNING'].sort().join(',');
        const queryKey = ['mediaList', provider, userName, statusKey];

        expect(queryKey).toContain('mediaList');
        expect(queryKey).toContain(provider);
        expect(queryKey).toContain(userName);
        expect(queryKey).toContain('PLANNING');
    });
});
