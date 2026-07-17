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
});
