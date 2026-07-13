const MAL_API_URL = 'https://api.myanimelist.net/v2';

const USERNAME_REGEX = /^[A-Za-z0-9_-]+$/;

function isValidUsername(username: string | undefined | null): username is string {
    return typeof username === 'string' && USERNAME_REGEX.test(username);
}

function userNotFoundResponse(): Response {
    return Response.json({ error: 'user not found' }, { status: 404 });
}

async function fetchMalUpstream(path: string): Promise<Response> {
    const clientId = process.env.MAL_CLIENT_ID;

    if (!clientId) {
        console.error('MAL_CLIENT_ID is not configured; refusing to call MAL upstream.');
        return Response.json({ error: 'MAL API is not configured' }, { status: 500 });
    }

    const upstream = await fetch(`${MAL_API_URL}${path}`, {
        headers: { 'X-MAL-Client-ID': clientId },
    });

    if (upstream.ok) {
        const body = await upstream.json();
        return Response.json(body, { status: upstream.status });
    }

    if (upstream.status === 404) {
        return userNotFoundResponse();
    }

    if (upstream.status === 429) {
        const retryAfter = upstream.headers.get('Retry-After');
        return Response.json(
            { error: 'MAL API rate limit exceeded' },
            { status: 429, headers: retryAfter ? { 'Retry-After': retryAfter } : undefined },
        );
    }

    if (upstream.status === 401 || upstream.status === 403) {
        console.error(`MAL upstream auth error: ${upstream.status} ${upstream.statusText}`);
        return Response.json({ error: 'MAL API error: upstream authentication failed' }, { status: 502 });
    }

    return Response.json(
        { error: `MAL API error: ${upstream.status} ${upstream.statusText}` },
        { status: upstream.status },
    );
}

export { fetchMalUpstream, isValidUsername, userNotFoundResponse };
