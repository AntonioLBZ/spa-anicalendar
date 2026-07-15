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
                                { idMal: 21, nextAiringEpisode: { airingAt: 1784470560, episode: 1170 } },
                                { idMal: 20, nextAiringEpisode: null },
                            ],
                        },
                    },
                }),
                { status: 200 },
            ),
        );

        const result = await getNextAiringByMalIds([21, 20]);

        expect(result).toEqual({ 21: { airingAt: 1784470560, episode: 1170 } });
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
                                { id: 207141, nextAiringEpisode: { airingAt: 1784215800, episode: 3 } },
                                { id: 12345, nextAiringEpisode: null },
                            ],
                        },
                    },
                }),
                { status: 200 },
            ),
        );

        const result = await getNextAiringByAnilistIds([207141, 12345]);

        expect(result).toEqual({ 207141: { airingAt: 1784215800, episode: 3 } });
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
