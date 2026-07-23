import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getMediaList } from '../media-list.query';

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

    it('documents page[limit]=20 boundary: handles combined current+planned results at the limit', async () => {
        // Kitsu's page[limit]=20 is currently safe because combined watching+planning rarely reaches 20
        // (watching-only lists typically <20, planned lists even smaller for active users).
        // This test documents the current boundary behavior. If page[limit] is ever raised above ~50,
        // see media-list.query.ts comment about AniList chunking constraint.
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

        // All 20 results should be returned (no silent truncation on Kitsu's end)
        expect(entries).toHaveLength(20);
        // Verify the combined filter[status] was used in the request
        const call = fetchMock.mock.calls[0][0];
        expect(typeof call === 'string' && call.includes('filter[status]=current,planned')).toBe(true);
    });
});
