import { beforeEach, describe, expect, it, vi } from 'vitest';

import { kitsuProvider } from '../kitsu.provider';

import type { User } from '@/services/models';

const getMediaListMock = vi.hoisted(() => vi.fn().mockResolvedValue([]));
const getCandidateAnimeIdsMock = vi.hoisted(() => vi.fn().mockResolvedValue([]));

vi.mock('../media-list', () => ({
    getMediaList: getMediaListMock,
    getCandidateAnimeIds: getCandidateAnimeIdsMock,
}));

vi.mock('../user-data', () => ({
    getUserByName: vi.fn(),
}));

const user: User = { id: 1, name: 'test-user', avatarUrl: 'avatar.jpg', siteUrl: 'https://kitsu.io/users/1' };

describe('kitsuProvider.getMediaList', () => {
    beforeEach(() => {
        getMediaListMock.mockClear();
        getMediaListMock.mockResolvedValue([]);
        getCandidateAnimeIdsMock.mockClear();
        getCandidateAnimeIdsMock.mockResolvedValue([]);
    });

    it('fetches WATCHING directly, with no candidate-id scoping', async () => {
        await kitsuProvider.getMediaList(user, ['WATCHING']);

        expect(getCandidateAnimeIdsMock).not.toHaveBeenCalled();
        expect(getMediaListMock).toHaveBeenCalledWith(user, ['WATCHING']);
    });

    it('issues one request per requested status, not a combined one, when both are requested', async () => {
        await kitsuProvider.getMediaList(user, ['WATCHING', 'PLANNING']);

        expect(getMediaListMock).toHaveBeenCalledTimes(2);
        expect(getMediaListMock).toHaveBeenCalledWith(user, ['WATCHING']);
        expect(getMediaListMock).toHaveBeenCalledWith(user, ['PLANNING'], expect.any(Array));
    });

    it('merges (flattens) the results of both requests into a single array', async () => {
        const watchingEntry = { id: 1 } as never;
        const planningEntry = { id: 2 } as never;
        getMediaListMock.mockResolvedValueOnce([watchingEntry]).mockResolvedValueOnce([planningEntry]);

        const result = await kitsuProvider.getMediaList(user, ['WATCHING', 'PLANNING']);

        expect(result).toEqual([watchingEntry, planningEntry]);
    });

    it('for PLANNING, fetches candidate ids scoped by the current season and by the selected formats, then scopes the planning fetch to those ids', async () => {
        getCandidateAnimeIdsMock.mockResolvedValueOnce([1, 2]).mockResolvedValueOnce([2, 3]);

        await kitsuProvider.getMediaList(user, ['PLANNING'], { formats: ['TV'], onlyNewSeason: false });

        expect(getCandidateAnimeIdsMock).toHaveBeenCalledWith(
            expect.objectContaining({ season: expect.anything(), seasonYear: expect.anything(), formats: ['TV'] }),
        );
        expect(getCandidateAnimeIdsMock).toHaveBeenCalledWith(expect.objectContaining({ status: 'current', formats: ['TV'] }));
        expect(getMediaListMock).toHaveBeenCalledWith(user, ['PLANNING'], [1, 2, 3]);
    });

    it('for PLANNING with onlyNewSeason, skips the "currently airing regardless of season" candidate query', async () => {
        await kitsuProvider.getMediaList(user, ['PLANNING'], { formats: [], onlyNewSeason: true });

        expect(getCandidateAnimeIdsMock).toHaveBeenCalledTimes(1);
        expect(getCandidateAnimeIdsMock).toHaveBeenCalledWith(
            expect.objectContaining({ season: expect.anything(), seasonYear: expect.anything() }),
        );
    });
});
