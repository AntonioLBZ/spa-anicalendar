import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getNextAiringByAnilistIds, getNextAiringByMalIds } from '../anilist-airing-lookup';

describe('getNextAiringByMalIds', () => {
    let fetchMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        fetchMock = vi.fn();
        vi.stubGlobal('fetch', fetchMock);
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it('returns an empty map without calling AniList when there are no ids', async () => {
        const result = await getNextAiringByMalIds([]);

        expect(result).toEqual({});
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('maps idMal to nextAiringEpisode, skipping entries AniList has no airing data for', async () => {
        fetchMock.mockResolvedValueOnce(
            new Response(
                JSON.stringify({
                    data: {
                        Page: {
                            media: [
                                { idMal: 21, nextAiringEpisode: { airingAt: 1784470560, episode: 1170 }, season: 'FALL', seasonYear: 2024 },
                                { idMal: 20, nextAiringEpisode: null, season: null, seasonYear: null },
                            ],
                        },
                    },
                }),
                { status: 200 },
            ),
        );

        const result = await getNextAiringByMalIds([21, 20]);

        expect(result).toEqual({
            20: { nextAiringEpisode: undefined, season: undefined, seasonYear: undefined },
            21: { nextAiringEpisode: { airingAt: 1784470560, episode: 1170 }, season: 'FALL', seasonYear: 2024 },
        });
    });

    it('returns an empty map and logs when AniList responds with GraphQL errors', async () => {
        fetchMock.mockResolvedValueOnce(
            new Response(JSON.stringify({ errors: [{ message: 'boom' }] }), { status: 200 }),
        );

        const result = await getNextAiringByMalIds([21]);

        expect(result).toEqual({});
        expect(console.error).toHaveBeenCalled();
    });

    it('returns an empty map and logs when the request itself fails', async () => {
        fetchMock.mockRejectedValueOnce(new Error('network down'));

        const result = await getNextAiringByMalIds([21]);

        expect(result).toEqual({});
        expect(console.error).toHaveBeenCalled();
    });

    it('chunks ids into batches of 50 when exceeding AniList Page.perPage cap, merging all results', async () => {
        const manyIds = Array.from({ length: 51 }, (_, i) => i + 1);

        fetchMock
            .mockResolvedValueOnce(
                new Response(
                    JSON.stringify({
                        data: { Page: { media: [{ idMal: 1, nextAiringEpisode: { airingAt: 1000, episode: 1 }, season: 'FALL', seasonYear: 2024 }] } },
                    }),
                    { status: 200 },
                ),
            )
            .mockResolvedValueOnce(
                new Response(
                    JSON.stringify({
                        data: { Page: { media: [{ idMal: 51, nextAiringEpisode: { airingAt: 2000, episode: 5 }, season: 'FALL', seasonYear: 2024 }] } },
                    }),
                    { status: 200 },
                ),
            );

        const result = await getNextAiringByMalIds(manyIds);

        expect(fetchMock).toHaveBeenCalledTimes(2);
        const firstBody = JSON.parse(fetchMock.mock.calls[0][1].body as string);
        const secondBody = JSON.parse(fetchMock.mock.calls[1][1].body as string);
        expect(firstBody.variables.idMalIn).toHaveLength(50);
        expect(secondBody.variables.idMalIn).toHaveLength(1);
        expect(Object.keys(result)).toEqual(['1', '51']);
    });

    it('skips a failing chunk but still returns results from the others', async () => {
        const manyIds = Array.from({ length: 51 }, (_, i) => i + 1);

        fetchMock
            .mockResolvedValueOnce(new Response(JSON.stringify({ errors: [{ message: 'boom' }] }), { status: 200 }))
            .mockResolvedValueOnce(
                new Response(
                    JSON.stringify({
                        data: { Page: { media: [{ idMal: 51, nextAiringEpisode: null, season: null, seasonYear: null }] } },
                    }),
                    { status: 200 },
                ),
            );

        const result = await getNextAiringByMalIds(manyIds);

        expect(Object.keys(result)).toEqual(['51']);
        expect(console.error).toHaveBeenCalled();
    });
});

describe('getNextAiringByAnilistIds', () => {
    let fetchMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        fetchMock = vi.fn();
        vi.stubGlobal('fetch', fetchMock);
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it('returns an empty map without calling AniList when there are no ids', async () => {
        const result = await getNextAiringByAnilistIds([]);

        expect(result).toEqual({});
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('maps AniList id to nextAiringEpisode, skipping entries AniList has no airing data for', async () => {
        fetchMock.mockResolvedValueOnce(
            new Response(
                JSON.stringify({
                    data: {
                        Page: {
                            media: [
                                { id: 207141, nextAiringEpisode: { airingAt: 1784215800, episode: 3 }, season: 'SUMMER', seasonYear: 2025 },
                                { id: 12345, nextAiringEpisode: null, season: null, seasonYear: null },
                            ],
                        },
                    },
                }),
                { status: 200 },
            ),
        );

        const result = await getNextAiringByAnilistIds([207141, 12345]);

        expect(result).toEqual({
            12345: { nextAiringEpisode: undefined, season: undefined, seasonYear: undefined },
            207141: { nextAiringEpisode: { airingAt: 1784215800, episode: 3 }, season: 'SUMMER', seasonYear: 2025 },
        });
    });

    it('returns an empty map and logs when AniList responds with GraphQL errors', async () => {
        fetchMock.mockResolvedValueOnce(
            new Response(JSON.stringify({ errors: [{ message: 'boom' }] }), { status: 200 }),
        );

        const result = await getNextAiringByAnilistIds([207141]);

        expect(result).toEqual({});
        expect(console.error).toHaveBeenCalled();
    });

    it('returns an empty map and logs when the request itself fails', async () => {
        fetchMock.mockRejectedValueOnce(new Error('network down'));

        const result = await getNextAiringByAnilistIds([207141]);

        expect(result).toEqual({});
        expect(console.error).toHaveBeenCalled();
    });
});
