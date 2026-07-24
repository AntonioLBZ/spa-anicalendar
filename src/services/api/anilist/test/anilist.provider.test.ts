import { beforeEach, describe, expect, it, vi } from 'vitest';

import { anilistProvider } from '../anilist.provider';

import type { User } from '@/services/models';

const getMediaListMock = vi.hoisted(() => vi.fn().mockResolvedValue([]));
const getCandidateMediaIdsMock = vi.hoisted(() => vi.fn().mockResolvedValue([]));

vi.mock('../media-list', () => ({
    getMediaList: getMediaListMock,
    getCandidateMediaIds: getCandidateMediaIdsMock,
}));

vi.mock('../user-data', () => ({
    getUserByName: vi.fn(),
}));

const user: User = { id: 1, name: 'test-user', avatarUrl: 'avatar.jpg', siteUrl: 'https://anilist.co/user/1' };

describe('anilistProvider.getMediaList', () => {
    beforeEach(() => {
        getMediaListMock.mockClear();
        getMediaListMock.mockResolvedValue([]);
        getCandidateMediaIdsMock.mockClear();
        getCandidateMediaIdsMock.mockResolvedValue([]);
    });


    it('maps WATCHING to CURRENT and REPEATING', async () => {
        await anilistProvider.getMediaList(user, ['WATCHING']);

        expect(getMediaListMock).toHaveBeenCalledWith(
            expect.objectContaining({ statusIn: ['CURRENT', 'REPEATING'] })
        );
    });

    it('maps PLANNING to PLANNING', async () => {
        await anilistProvider.getMediaList(user, ['PLANNING']);

        expect(getMediaListMock).toHaveBeenCalledWith(expect.objectContaining({ statusIn: ['PLANNING'] }));
    });

    it('issues one paginated request per requested status when both are requested, not a combined union', async () => {
        await anilistProvider.getMediaList(user, ['WATCHING', 'PLANNING']);

        expect(getMediaListMock).toHaveBeenCalledTimes(2);
        expect(getMediaListMock).toHaveBeenCalledWith(expect.objectContaining({ statusIn: ['CURRENT', 'REPEATING'] }));
        expect(getMediaListMock).toHaveBeenCalledWith(expect.objectContaining({ statusIn: ['PLANNING'] }));
    });

    it('merges (flattens) the results of both requests into a single array', async () => {
        const watchingEntry = { id: 1 } as never;
        const planningEntry = { id: 2 } as never;
        getMediaListMock.mockResolvedValueOnce([watchingEntry]).mockResolvedValueOnce([planningEntry]);

        const result = await anilistProvider.getMediaList(user, ['WATCHING', 'PLANNING']);

        expect(result).toEqual([watchingEntry, planningEntry]);
    });

    it('for PLANNING, fetches candidate ids scoped by the current season and by the selected formats, then scopes the planning fetch to those ids', async () => {
        getCandidateMediaIdsMock.mockResolvedValueOnce([1, 2]).mockResolvedValueOnce([2, 3]);

        await anilistProvider.getMediaList(user, ['PLANNING'], { formats: ['TV'], onlyNewSeason: false });

        expect(getCandidateMediaIdsMock).toHaveBeenCalledWith(
            expect.objectContaining({ season: expect.anything(), seasonYear: expect.anything(), formats: ['TV'] }),
        );
        expect(getCandidateMediaIdsMock).toHaveBeenCalledWith(
            expect.objectContaining({ status: 'RELEASING', formats: ['TV'] }),
        );
        expect(getMediaListMock).toHaveBeenCalledWith(
            expect.objectContaining({ statusIn: ['PLANNING'], mediaIdIn: [1, 2, 3] }),
        );
    });

    it('for PLANNING with onlyNewSeason, skips the "currently releasing regardless of season" candidate query', async () => {
        await anilistProvider.getMediaList(user, ['PLANNING'], { formats: [], onlyNewSeason: true });

        expect(getCandidateMediaIdsMock).toHaveBeenCalledTimes(1);
        expect(getCandidateMediaIdsMock).toHaveBeenCalledWith(
            expect.objectContaining({ season: expect.anything(), seasonYear: expect.anything() }),
        );
    });
});
