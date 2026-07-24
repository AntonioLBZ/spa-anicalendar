class KitsuUserNotFoundError extends Error {}

// Accepts a relative path or an absolute URL, so callers can follow a JSON:API `links.next` URL verbatim.
async function kitsuFetch<T>(pathOrUrl: string): Promise<T> {
    const url = pathOrUrl.startsWith('http') ? pathOrUrl : `https://kitsu.app/api/edge${pathOrUrl}`;
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
