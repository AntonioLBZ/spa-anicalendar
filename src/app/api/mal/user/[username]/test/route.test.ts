import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { GET } from '../route';

function params(username: string): { params: Promise<{ username: string }> } {
    return { params: Promise.resolve({ username }) };
}

describe('GET /api/mal/user/[username]', () => {
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

    it('returns a locally-constructed profile when the existence probe succeeds', async () => {
        fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ data: [] }), { status: 200 }));

        const response = await GET(new Request('http://localhost/api/mal/user/lanzorzx'), params('lanzorzx'));

        expect(response.status).toBe(200);
        const body = await response.json();
        expect(body).toEqual({ name: 'lanzorzx' });
        expect(JSON.stringify(body)).not.toContain('test-client-id');

        expect(fetchMock).toHaveBeenCalledTimes(1);
        const [url, options] = fetchMock.mock.calls[0];
        expect(url).toContain('/users/lanzorzx/animelist');
        expect(options.headers['X-MAL-Client-ID']).toBe('test-client-id');
    });

    it('rejects a blank username with 400', async () => {
        const response = await GET(new Request('http://localhost/api/mal/user/'), params(''));

        expect(response.status).toBe(400);
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('rejects an invalid username with 400', async () => {
        const response = await GET(new Request('http://localhost/api/mal/user/bad name!'), params('bad name!'));

        expect(response.status).toBe(400);
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('returns 500 and makes no upstream call when MAL_CLIENT_ID is unset', async () => {
        process.env.MAL_CLIENT_ID = '';

        const response = await GET(new Request('http://localhost/api/mal/user/lanzorzx'), params('lanzorzx'));

        expect(response.status).toBe(500);
        expect(fetchMock).not.toHaveBeenCalled();
        expect(console.error).toHaveBeenCalled();
    });

    it('maps upstream 404 to a distinguishable "user not found" response', async () => {
        fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ error: 'not_found' }), { status: 404 }));

        const response = await GET(
            new Request('http://localhost/api/mal/user/__definitely_not_a_real_mal_user_zzz__'),
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

        const response = await GET(new Request('http://localhost/api/mal/user/lanzorzx'), params('lanzorzx'));

        expect(response.status).toBe(429);
        expect(response.headers.get('Retry-After')).toBe('30');
    });

    it('maps upstream 401/403 to 502', async () => {
        fetchMock.mockResolvedValueOnce(new Response(null, { status: 401 }));

        const response = await GET(new Request('http://localhost/api/mal/user/lanzorzx'), params('lanzorzx'));

        expect(response.status).toBe(502);
        expect(console.error).toHaveBeenCalled();
    });
});
