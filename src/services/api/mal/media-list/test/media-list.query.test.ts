import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getMediaList } from '../media-list.query';

import type { MalAnimeListEntry } from '../media-list.types';

const getNextAiringByMalIdsMock = vi.hoisted(() => vi.fn().mockResolvedValue({}));
const malFetchMock = vi.hoisted(() => vi.fn());

vi.mock('../../../shared', async (importOriginal) => ({
    ...(await importOriginal<typeof import('../../../shared')>()),
    getNextAiringByMalIds: getNextAiringByMalIdsMock,
}));

vi.mock('../../client', () => ({
    malFetch: malFetchMock,
}));

function entry(id: number): MalAnimeListEntry {
    return {
        node: { id, title: `Anime ${id}`, status: 'finished_airing', media_type: 'tv' },
        list_status: {
            status: 'watching',
            score: 0,
            num_episodes_watched: 0,
            is_rewatching: false,
            updated_at: '2026-01-01T00:00:00+00:00',
        },
    };
}

describe('getMediaList', () => {
    beforeEach(() => {
        malFetchMock.mockReset();
        getNextAiringByMalIdsMock.mockReset().mockResolvedValue({});
    });

    it('issues a single request with status=watching by default', async () => {
        malFetchMock.mockResolvedValueOnce({ data: [entry(1)] });

        const result = await getMediaList('lanzorzx');

        expect(malFetchMock).toHaveBeenCalledTimes(1);
        expect(malFetchMock.mock.calls[0][0]).toContain('status=watching');
        expect(result).toHaveLength(1);
    });

    it('issues two requests and merges results when both WATCHING and PLANNING are requested', async () => {
        malFetchMock.mockResolvedValueOnce({ data: [entry(1)] }).mockResolvedValueOnce({ data: [entry(2)] });

        const result = await getMediaList('lanzorzx', ['WATCHING', 'PLANNING']);

        expect(malFetchMock).toHaveBeenCalledTimes(2);
        expect(malFetchMock.mock.calls[0][0]).toContain('status=watching');
        expect(malFetchMock.mock.calls[1][0]).toContain('status=plan_to_watch');
        expect(result.map((e) => e.id).sort()).toEqual([1, 2]);
    });

    it('issues a single request with status=plan_to_watch when only PLANNING is requested', async () => {
        malFetchMock.mockResolvedValueOnce({ data: [entry(3)] });

        await getMediaList('lanzorzx', ['PLANNING']);

        expect(malFetchMock).toHaveBeenCalledTimes(1);
        expect(malFetchMock.mock.calls[0][0]).toContain('status=plan_to_watch');
    });
});
