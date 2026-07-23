import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getCandidateMediaIds, getMediaList } from '../media-list.query';

function mediaListPage(count: number, startId = 1) {
    return Array.from({ length: count }, (_, i) => ({
        id: startId + i,
        status: 'CURRENT',
        media: {
            coverImage: { medium: '', large: '' },
            chapters: null,
            episodes: null,
            duration: null,
            status: 'RELEASING',
            nextAiringEpisode: null,
            siteUrl: '',
            title: { userPreferred: `Anime ${startId + i}` },
            endDate: { day: null, month: null, year: null },
            isAdult: false,
            season: 'FALL',
            seasonYear: 2026,
            format: 'TV',
            genres: [],
        },
        progress: 0,
        mediaId: startId + i,
        repeat: 0,
    }));
}

describe('getMediaList (AniList) pagination', () => {
    let fetchMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        fetchMock = vi.fn();
        vi.stubGlobal('fetch', fetchMock);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('issues exactly one request when the list fits in a single page', async () => {
        fetchMock.mockResolvedValueOnce(
            new Response(
                JSON.stringify({ data: { Page: { pageInfo: { hasNextPage: false }, mediaList: mediaListPage(10) } } }),
                { status: 200 },
            ),
        );

        const result = await getMediaList({ userId: 1, type: 'ANIME', statusIn: ['CURRENT', 'REPEATING'] });

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(result).toHaveLength(10);
    });

    it('pages through multiple pages when hasNextPage is true, accumulating all entries (the 360-planning-entry case)', async () => {
        fetchMock
            .mockResolvedValueOnce(
                new Response(
                    JSON.stringify({ data: { Page: { pageInfo: { hasNextPage: true }, mediaList: mediaListPage(50, 1) } } }),
                    { status: 200 },
                ),
            )
            .mockResolvedValueOnce(
                new Response(
                    JSON.stringify({ data: { Page: { pageInfo: { hasNextPage: true }, mediaList: mediaListPage(50, 51) } } }),
                    { status: 200 },
                ),
            )
            .mockResolvedValueOnce(
                new Response(
                    JSON.stringify({ data: { Page: { pageInfo: { hasNextPage: false }, mediaList: mediaListPage(10, 101) } } }),
                    { status: 200 },
                ),
            );

        const result = await getMediaList({ userId: 1, type: 'ANIME', statusIn: ['PLANNING'] });

        expect(fetchMock).toHaveBeenCalledTimes(3);
        expect(result).toHaveLength(110);
    });

    it('sends an incrementing page variable and a fixed perPage on each request', async () => {
        fetchMock
            .mockResolvedValueOnce(
                new Response(
                    JSON.stringify({ data: { Page: { pageInfo: { hasNextPage: true }, mediaList: mediaListPage(50, 1) } } }),
                    { status: 200 },
                ),
            )
            .mockResolvedValueOnce(
                new Response(
                    JSON.stringify({ data: { Page: { pageInfo: { hasNextPage: false }, mediaList: mediaListPage(5, 51) } } }),
                    { status: 200 },
                ),
            );

        await getMediaList({ userId: 1, type: 'ANIME', statusIn: ['PLANNING'] });

        const firstCallBody = JSON.parse(fetchMock.mock.calls[0][1].body);
        const secondCallBody = JSON.parse(fetchMock.mock.calls[1][1].body);

        expect(firstCallBody.variables.page).toBe(1);
        expect(firstCallBody.variables.perPage).toBe(50);
        expect(secondCallBody.variables.page).toBe(2);
        expect(secondCallBody.variables.perPage).toBe(50);
    });

    it('stops paging once the safety cap is reached, even if the API keeps claiming hasNextPage: true', async () => {
        fetchMock.mockImplementation(
            async () =>
                new Response(
                    JSON.stringify({ data: { Page: { pageInfo: { hasNextPage: true }, mediaList: mediaListPage(50, 1) } } }),
                    { status: 200 },
                ),
        );

        await getMediaList({ userId: 1, type: 'ANIME', statusIn: ['PLANNING'] });

        expect(fetchMock.mock.calls.length).toBeLessThanOrEqual(40);
    });

    it('throws when AniList returns GraphQL errors', async () => {
        fetchMock.mockResolvedValueOnce(
            new Response(JSON.stringify({ data: null, errors: [{ message: 'Something went wrong' }] }), { status: 200 }),
        );

        await expect(getMediaList({ userId: 1, type: 'ANIME', statusIn: ['PLANNING'] })).rejects.toThrow(
            'Something went wrong',
        );
    });
});

describe('getCandidateMediaIds (AniList)', () => {
    let fetchMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        fetchMock = vi.fn();
        vi.stubGlobal('fetch', fetchMock);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('stops after one request when the first page has no more results', async () => {
        fetchMock.mockResolvedValueOnce(
            new Response(
                JSON.stringify({ data: { Page: { pageInfo: { hasNextPage: false }, media: [{ id: 1 }, { id: 2 }] } } }),
                { status: 200 },
            ),
        );

        const result = await getCandidateMediaIds({ season: 'FALL', seasonYear: 2026 });

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(result).toEqual([1, 2]);

        const body = JSON.parse(fetchMock.mock.calls[0][1].body);
        expect(body.variables.perPage).toBe(50);
        expect(body.variables.page).toBe(1);
    });

    it('pages up to a cap of 2 pages (100 candidates) when hasNextPage keeps being true', async () => {
        fetchMock.mockImplementation(
            async () =>
                new Response(
                    JSON.stringify({ data: { Page: { pageInfo: { hasNextPage: true }, media: [{ id: 1 }] } } }),
                    { status: 200 },
                ),
        );

        await getCandidateMediaIds({ status: 'RELEASING' });

        expect(fetchMock).toHaveBeenCalledTimes(2);
        const firstBody = JSON.parse(fetchMock.mock.calls[0][1].body);
        const secondBody = JSON.parse(fetchMock.mock.calls[1][1].body);
        expect(firstBody.variables.page).toBe(1);
        expect(secondBody.variables.page).toBe(2);
    });

    it('sends format_in only when formats are provided', async () => {
        fetchMock.mockImplementation(
            async () =>
                new Response(JSON.stringify({ data: { Page: { pageInfo: { hasNextPage: false }, media: [] } } }), {
                    status: 200,
                }),
        );

        await getCandidateMediaIds({ status: 'RELEASING', formats: ['TV', 'MOVIE'] });

        const body = JSON.parse(fetchMock.mock.calls[0][1].body);
        expect(body.variables.formatIn).toEqual(['TV', 'MOVIE']);

        fetchMock.mockClear();
        await getCandidateMediaIds({ status: 'RELEASING' });

        const secondBody = JSON.parse(fetchMock.mock.calls[0][1].body);
        expect(secondBody.variables.formatIn).toBeUndefined();
    });

    it('throws when AniList returns GraphQL errors', async () => {
        fetchMock.mockResolvedValueOnce(
            new Response(JSON.stringify({ data: null, errors: [{ message: 'Something went wrong' }] }), { status: 200 }),
        );

        await expect(getCandidateMediaIds({ status: 'RELEASING' })).rejects.toThrow('Something went wrong');
    });
});
