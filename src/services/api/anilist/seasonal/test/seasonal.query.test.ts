import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getSeasonalMedia } from '../seasonal.query';

describe('getSeasonalMedia', () => {
    let fetchMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        fetchMock = vi.fn();
        vi.stubGlobal('fetch', fetchMock);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('issues exactly one request for a single page of up to 50 entries, no pagination loop', async () => {
        const media = Array.from({ length: 50 }, (_, i) => ({
            id: i + 1,
            coverImage: { medium: '', large: '' },
            chapters: null,
            episodes: null,
            duration: null,
            status: 'RELEASING',
            nextAiringEpisode: null,
            siteUrl: '',
            title: { userPreferred: `Anime ${i + 1}` },
            endDate: { day: null, month: null, year: null },
            isAdult: false,
            season: 'FALL',
            genres: [],
        }));

        fetchMock.mockResolvedValueOnce(
            new Response(JSON.stringify({ data: { Page: { media } } }), { status: 200 })
        );

        const result = await getSeasonalMedia({ season: 'FALL', seasonYear: 2026 });

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(result).toHaveLength(50);
    });

    it('sends format_in when formats are provided, and omits it when they are not', async () => {
        fetchMock.mockImplementation(
            async () => new Response(JSON.stringify({ data: { Page: { media: [] } } }), { status: 200 })
        );

        await getSeasonalMedia({ season: 'FALL', seasonYear: 2026, formats: ['MOVIE', 'OVA'] });
        const body = JSON.parse(fetchMock.mock.calls[0][1].body);
        expect(body.variables.format_in).toEqual(['MOVIE', 'OVA']);

        await getSeasonalMedia({ season: 'FALL', seasonYear: 2026 });
        const secondBody = JSON.parse(fetchMock.mock.calls[1][1].body);
        expect(secondBody.variables.format_in).toBeUndefined();
    });

    it('omits season/seasonYear by default (and when onlyNewSeason is false), includes them only when onlyNewSeason is true', async () => {
        fetchMock.mockImplementation(
            async () => new Response(JSON.stringify({ data: { Page: { media: [] } } }), { status: 200 })
        );

        await getSeasonalMedia({ season: 'FALL', seasonYear: 2026 });
        const body = JSON.parse(fetchMock.mock.calls[0][1].body);
        expect(body.variables.season).toBeUndefined();
        expect(body.variables.seasonYear).toBeUndefined();

        await getSeasonalMedia({ season: 'FALL', seasonYear: 2026, onlyNewSeason: true });
        const secondBody = JSON.parse(fetchMock.mock.calls[1][1].body);
        expect(secondBody.variables.season).toBe('FALL');
        expect(secondBody.variables.seasonYear).toBe(2026);
    });

    it('clamps perPage to the AniList max of 50', async () => {
        fetchMock.mockResolvedValue(new Response(JSON.stringify({ data: { Page: { media: [] } } }), { status: 200 }));

        await getSeasonalMedia({ season: 'FALL', seasonYear: 2026, perPage: 100 });
        const body = JSON.parse(fetchMock.mock.calls[0][1].body);
        expect(body.variables.perPage).toBe(50);
    });
});
