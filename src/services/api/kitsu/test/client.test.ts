import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { KitsuUserNotFoundError, kitsuFetch } from '../client';

describe('kitsuFetch', () => {
    let fetchMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        fetchMock = vi.fn();
        vi.stubGlobal('fetch', fetchMock);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('returns parsed JSON on success', async () => {
        fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ data: [] }), { status: 200 }));

        const result = await kitsuFetch('/users?filter[name]=someone');

        expect(result).toEqual({ data: [] });
        expect(fetchMock).toHaveBeenCalledWith('https://kitsu.app/api/edge/users?filter[name]=someone');
    });

    it('throws KitsuUserNotFoundError on 404', async () => {
        fetchMock.mockResolvedValueOnce(new Response(null, { status: 404, statusText: 'Not Found' }));

        await expect(kitsuFetch('/users?filter[name]=missing')).rejects.toThrow(KitsuUserNotFoundError);
    });

    it('throws a generic Error on other non-OK statuses', async () => {
        fetchMock.mockResolvedValueOnce(new Response(null, { status: 500, statusText: 'Internal Server Error' }));

        await expect(kitsuFetch('/users?filter[name]=someone')).rejects.toThrow('Kitsu API error: 500 Internal Server Error.');
    });
});
