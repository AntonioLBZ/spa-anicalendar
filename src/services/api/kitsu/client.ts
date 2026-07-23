class KitsuUserNotFoundError extends Error {}

// Accepts either a relative path (prefixed with Kitsu's base URL) or an absolute URL — the latter
// lets callers follow a JSON:API `links.next` pagination URL verbatim, since Kitsu returns those
// as full URLs, not paths.
async function kitsuFetch<T>(pathOrUrl: string): Promise<T> {
    const url = pathOrUrl.startsWith('http') ? pathOrUrl : `https://kitsu.io/api/edge${pathOrUrl}`;
    const response = await fetch(url);

    if (!response.ok) {
        if (response.status === 404) {
            throw new KitsuUserNotFoundError(`Kitsu API error: ${response.status} ${response.statusText}.`);
        }
        throw new Error(`Kitsu API error: ${response.status} ${response.statusText}.`);
    }

    return response.json();
}

export { kitsuFetch, KitsuUserNotFoundError };
