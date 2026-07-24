import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { GET } from '../route';

function params(username: string): { params: Promise<{ username: string }> } {
    return { params: Promise.resolve({ username }) };
}

describe('GET /api/mal/animelist/[username]', () => {
    const originalClientId = process.env.MAL_CLIENT_ID;
    let fetchMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        process.env.MAL_CLIENT_ID = 'test-client-id';
        fetchMock = vi.fn();
        vi.stubGlobal('fetch', fetchMock);
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        process.env.MAL_CLIENT_ID = originalClientId;
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it('returns upstream JSON on success without exposing the client id', async () => {
        const upstreamBody = { data: [{ node: { id: 1, title: 'One Piece' } }] };
        fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(upstreamBody), { status: 200 }));

        const response = await GET(
            new Request('http://localhost/api/mal/animelist/lanzorzx'),
            params('lanzorzx'),
        );

        expect(response.status).toBe(200);
        await expect(response.json()).resolves.toEqual(upstreamBody);

        expect(fetchMock).toHaveBeenCalledTimes(1);
        const [url, options] = fetchMock.mock.calls[0];
        expect(url).toContain('/users/lanzorzx/animelist');
        expect(options.headers['X-MAL-Client-ID']).toBe('test-client-id');
    });

    it('rejects a blank username with 400', async () => {
        const response = await GET(new Request('http://localhost/api/mal/animelist/'), params(''));

        expect(response.status).toBe(400);
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('rejects an invalid username with 400', async () => {
        const response = await GET(
            new Request('http://localhost/api/mal/animelist/bad name!'),
            params('bad name!'),
        );

        expect(response.status).toBe(400);
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('returns 500 and makes no upstream call when MAL_CLIENT_ID is unset', async () => {
        process.env.MAL_CLIENT_ID = '';

        const response = await GET(
            new Request('http://localhost/api/mal/animelist/lanzorzx'),
            params('lanzorzx'),
        );

        expect(response.status).toBe(500);
        expect(fetchMock).not.toHaveBeenCalled();
        expect(console.error).toHaveBeenCalled();
    });

    it('maps upstream 404 to a distinguishable "user not found" response', async () => {
        fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ error: 'not_found' }), { status: 404 }));

        const response = await GET(
            new Request('http://localhost/api/mal/animelist/__definitely_not_a_real_mal_user_zzz__'),
            params('__definitely_not_a_real_mal_user_zzz__'),
        );

        expect(response.status).toBe(404);
        const body = await response.json();
        expect(body).toHaveProperty('error');
    });

    it('propagates upstream 429 with Retry-After', async () => {
        fetchMock.mockResolvedValueOnce(
            new Response(null, { status: 429, headers: { 'Retry-After': '30' } }),
        );

        const response = await GET(
            new Request('http://localhost/api/mal/animelist/lanzorzx'),
            params('lanzorzx'),
        );

        expect(response.status).toBe(429);
        expect(response.headers.get('Retry-After')).toBe('30');
    });

    it('maps upstream 401/403 to 502', async () => {
        fetchMock.mockResolvedValueOnce(new Response(null, { status: 403 }));

        const response = await GET(
            new Request('http://localhost/api/mal/animelist/lanzorzx'),
            params('lanzorzx'),
        );

        expect(response.status).toBe(502);
        expect(console.error).toHaveBeenCalled();
    });

    it('forwards an allowlisted status param to the MAL upstream URL', async () => {
        fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ data: [] }), { status: 200 }));

        await GET(
            new Request('http://localhost/api/mal/animelist/lanzorzx?status=plan_to_watch'),
            params('lanzorzx'),
        );

        const [url] = fetchMock.mock.calls[0];
        expect(url).toContain('status=plan_to_watch');
    });

    it('ignores a non-allowlisted status value and falls back to watching', async () => {
        fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ data: [] }), { status: 200 }));

        await GET(
            new Request('http://localhost/api/mal/animelist/lanzorzx?status=completed'),
            params('lanzorzx'),
        );

        const [url] = fetchMock.mock.calls[0];
        expect(url).toContain('status=watching');
        expect(url).not.toContain('status=completed');
    });

    it('defaults to watching when no status param is supplied', async () => {
        fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ data: [] }), { status: 200 }));

        await GET(new Request('http://localhost/api/mal/animelist/lanzorzx'), params('lanzorzx'));

        const [url] = fetchMock.mock.calls[0];
        expect(url).toContain('status=watching');
    });

    it('sorts by most recently updated in the user list', async () => {
        fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ data: [] }), { status: 200 }));

        await GET(new Request('http://localhost/api/mal/animelist/lanzorzx'), params('lanzorzx'));

        const [url] = fetchMock.mock.calls[0];
        expect(url).toContain('sort=list_updated_at');
    });
});
