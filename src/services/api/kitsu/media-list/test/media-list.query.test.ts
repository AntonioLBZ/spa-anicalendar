import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getCandidateAnimeIds, getMediaList } from '../media-list.query';

import type { User } from '@/services/models';

describe('Kitsu getMediaList', () => {
    let fetchMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        fetchMock = vi.fn();
        vi.stubGlobal('fetch', fetchMock);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it('parametrizes filter[status] from statuses: WATCHING only', async () => {
        fetchMock.mockResolvedValueOnce(
            new Response(
                JSON.stringify({
                    data: [],
                    included: [],
                }),
                { status: 200 },
            ),
        );

        const user: User = { id: 1, name: 'testuser', avatarUrl: '', siteUrl: '' };
        await getMediaList(user, ['WATCHING']);

        const call = fetchMock.mock.calls[0][0];
        expect(typeof call === 'string' && call.includes('filter[status]=current')).toBe(true);
    });

    it('parametrizes filter[status] from statuses: PLANNING only', async () => {
        fetchMock.mockResolvedValueOnce(
            new Response(
                JSON.stringify({
                    data: [],
                    included: [],
                }),
                { status: 200 },
            ),
        );

        const user: User = { id: 1, name: 'testuser', avatarUrl: '', siteUrl: '' };
        await getMediaList(user, ['PLANNING']);

        const call = fetchMock.mock.calls[0][0];
        expect(typeof call === 'string' && call.includes('filter[status]=planned')).toBe(true);
    });

    it('combines statuses with comma: WATCHING + PLANNING', async () => {
        fetchMock.mockResolvedValueOnce(
            new Response(
                JSON.stringify({
                    data: [],
                    included: [],
                }),
                { status: 200 },
            ),
        );

        const user: User = { id: 1, name: 'testuser', avatarUrl: '', siteUrl: '' };
        await getMediaList(user, ['WATCHING', 'PLANNING']);

        const call = fetchMock.mock.calls[0][0];
        expect(typeof call === 'string' && call.includes('filter[status]=current,planned')).toBe(true);
    });

    it('defaults to WATCHING when statuses not provided', async () => {
        fetchMock.mockResolvedValueOnce(
            new Response(
                JSON.stringify({
                    data: [],
                    included: [],
                }),
                { status: 200 },
            ),
        );

        const user: User = { id: 1, name: 'testuser', avatarUrl: '', siteUrl: '' };
        await getMediaList(user);

        const call = fetchMock.mock.calls[0][0];
        expect(typeof call === 'string' && call.includes('filter[status]=current')).toBe(true);
    });

    it('relaxes the airing-status filter to include finished and upcoming entries', async () => {
        // This test verifies that the client-side filter no longer drops non-current airing statuses
        fetchMock.mockResolvedValueOnce(
            new Response(
                JSON.stringify({
                    data: [
                        {
                            type: 'libraryEntries',
                            id: '1',
                            attributes: { status: 'current', progress: 0, reconsumeCount: 0 },
                            relationships: { anime: { data: { type: 'anime', id: '1' } } },
                        },
                    ],
                    included: [
                        {
                            type: 'anime',
                            id: '1',
                            attributes: {
                                canonicalTitle: 'Test Anime',
                                slug: 'test-anime',
                                status: 'finished', // This should NOT be filtered out
                                endDate: null,
                                episodeCount: 12,
                                episodeLength: 24,
                                ageRating: 'PG',
                                posterImage: null,
                            },
                        },
                    ],
                }),
                { status: 200 },
            ),
        );

        const user: User = { id: 1, name: 'testuser', avatarUrl: '', siteUrl: '' };
        const entries = await getMediaList(user, ['WATCHING']);

        // Entry with finished status should be included in the result
        expect(entries).toHaveLength(1);
        expect(entries[0].status).toBe('FINISHED');
    });

    it('handles a full page of 20 results with no next link (single page, no truncation)', async () => {
        const largeResult = Array.from({ length: 20 }, (_, i) => ({
            type: 'libraryEntries',
            id: String(i + 1),
            attributes: { status: 'current', progress: 0, reconsumeCount: 0 },
            relationships: { anime: { data: { type: 'anime', id: String(i + 1) } } },
        }));

        const animeData = Array.from({ length: 20 }, (_, i) => ({
            type: 'anime',
            id: String(i + 1),
            attributes: {
                canonicalTitle: `Test Anime ${i + 1}`,
                slug: `test-anime-${i + 1}`,
                status: 'current',
                endDate: null,
                episodeCount: 12,
                episodeLength: 24,
                ageRating: 'PG',
                posterImage: null,
            },
        }));

        fetchMock.mockResolvedValueOnce(
            new Response(
                JSON.stringify({
                    data: largeResult,
                    included: animeData,
                }),
                { status: 200 },
            ),
        );

        const user: User = { id: 1, name: 'testuser', avatarUrl: '', siteUrl: '' };
        const entries = await getMediaList(user, ['WATCHING', 'PLANNING']);

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(entries).toHaveLength(20);
        const call = fetchMock.mock.calls[0][0];
        expect(typeof call === 'string' && call.includes('filter[status]=current,planned')).toBe(true);
    });

    it('follows links.next to page through a planning backlog beyond page[limit]=20 (the 360-entry case)', async () => {
        function page(count: number, startId: number) {
            return {
                data: Array.from({ length: count }, (_, i) => ({
                    type: 'libraryEntries',
                    id: String(startId + i),
                    attributes: { status: 'planned', progress: 0, reconsumeCount: 0 },
                    relationships: { anime: { data: { type: 'anime', id: String(startId + i) } } },
                })),
                included: Array.from({ length: count }, (_, i) => ({
                    type: 'anime',
                    id: String(startId + i),
                    attributes: {
                        canonicalTitle: `Anime ${startId + i}`,
                        slug: `anime-${startId + i}`,
                        status: 'finished',
                        endDate: null,
                        episodeCount: 12,
                        episodeLength: 24,
                        ageRating: 'PG',
                        posterImage: null,
                    },
                })),
            };
        }

        fetchMock
            .mockResolvedValueOnce(
                new Response(
                    JSON.stringify({ ...page(20, 1), links: { next: 'https://kitsu.io/api/edge/library-entries?page[offset]=20' } }),
                    { status: 200 },
                ),
            )
            .mockResolvedValueOnce(
                new Response(
                    JSON.stringify({ ...page(20, 21), links: { next: 'https://kitsu.io/api/edge/library-entries?page[offset]=40' } }),
                    { status: 200 },
                ),
            )
            .mockResolvedValueOnce(new Response(JSON.stringify(page(5, 41)), { status: 200 }));

        const user: User = { id: 1, name: 'testuser', avatarUrl: '', siteUrl: '' };
        const entries = await getMediaList(user, ['PLANNING']);

        expect(fetchMock).toHaveBeenCalledTimes(3);
        expect(entries).toHaveLength(45);
        // The 2nd/3rd requests must follow the absolute links.next URL verbatim, not re-derive it
        expect(fetchMock.mock.calls[1][0]).toBe('https://kitsu.io/api/edge/library-entries?page[offset]=20');
        expect(fetchMock.mock.calls[2][0]).toBe('https://kitsu.io/api/edge/library-entries?page[offset]=40');
    });

    it('stops paging once the safety cap is reached, even if links.next keeps being present', async () => {
        fetchMock.mockImplementation(
            async () =>
                new Response(
                    JSON.stringify({
                        data: [
                            {
                                type: 'libraryEntries',
                                id: '1',
                                attributes: { status: 'planned', progress: 0, reconsumeCount: 0 },
                                relationships: { anime: { data: { type: 'anime', id: '1' } } },
                            },
                        ],
                        included: [],
                        links: { next: 'https://kitsu.io/api/edge/library-entries?page[offset]=999' },
                    }),
                    { status: 200 },
                ),
        );

        const user: User = { id: 1, name: 'testuser', avatarUrl: '', siteUrl: '' };
        await getMediaList(user, ['PLANNING']);

        expect(fetchMock.mock.calls.length).toBeLessThanOrEqual(40);
    });

    it('skips the request entirely when animeIdIn is an empty array', async () => {
        const user: User = { id: 1, name: 'testuser', avatarUrl: '', siteUrl: '' };
        const entries = await getMediaList(user, ['PLANNING'], []);

        expect(fetchMock).not.toHaveBeenCalled();
        expect(entries).toEqual([]);
    });

    it('sends filter[anime_id] when animeIdIn is provided', async () => {
        fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ data: [], included: [] }), { status: 200 }));

        const user: User = { id: 1, name: 'testuser', avatarUrl: '', siteUrl: '' };
        await getMediaList(user, ['PLANNING'], [11380, 29]);

        const call = fetchMock.mock.calls[0][0];
        expect(typeof call === 'string' && call.includes('filter[anime_id]=11380,29')).toBe(true);
    });
});

describe('getCandidateAnimeIds (Kitsu)', () => {
    let fetchMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        fetchMock = vi.fn();
        vi.stubGlobal('fetch', fetchMock);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it('stops after one request when the first page has no next link', async () => {
        fetchMock.mockResolvedValueOnce(
            new Response(JSON.stringify({ data: [{ type: 'anime', id: '1' }, { type: 'anime', id: '2' }] }), {
                status: 200,
            }),
        );

        const result = await getCandidateAnimeIds({ season: 'FALL', seasonYear: 2026 });

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(result).toEqual([1, 2]);

        const call = fetchMock.mock.calls[0][0];
        expect(typeof call === 'string' && call.includes('filter[season]=fall')).toBe(true);
        expect(typeof call === 'string' && call.includes('filter[seasonYear]=2026')).toBe(true);
        expect(typeof call === 'string' && call.includes('sort=popularityRank')).toBe(true);
        expect(typeof call === 'string' && call.includes('page[limit]=20')).toBe(true);
    });

    it('caps pagination at 5 pages (100 candidates) even if links.next keeps being present', async () => {
        fetchMock.mockImplementation(
            async () =>
                new Response(
                    JSON.stringify({
                        data: [{ type: 'anime', id: '1' }],
                        links: { next: 'https://kitsu.io/api/edge/anime?page[offset]=999' },
                    }),
                    { status: 200 },
                ),
        );

        await getCandidateAnimeIds({ status: 'current' });

        expect(fetchMock).toHaveBeenCalledTimes(5);
    });

    it('sends filter[subtype] mapped from MediaFormat, only when formats are provided', async () => {
        fetchMock.mockImplementation(
            async () => new Response(JSON.stringify({ data: [] }), { status: 200 }),
        );

        await getCandidateAnimeIds({ status: 'current', formats: ['TV', 'MOVIE'] });

        const body = fetchMock.mock.calls[0][0];
        expect(typeof body === 'string' && body.includes('filter[subtype]=TV,movie')).toBe(true);

        fetchMock.mockClear();
        await getCandidateAnimeIds({ status: 'current' });

        const secondCall = fetchMock.mock.calls[0][0];
        expect(typeof secondCall === 'string' && secondCall.includes('filter[subtype]')).toBe(false);
    });
});
