class KitsuUserNotFoundError extends Error {}

async function kitsuFetch<T>(path: string): Promise<T> {
    const response = await fetch(`https://kitsu.io/api/edge${path}`);

    if (!response.ok) {
        if (response.status === 404) {
            throw new KitsuUserNotFoundError(`Kitsu API error: ${response.status} ${response.statusText}.`);
        }
        throw new Error(`Kitsu API error: ${response.status} ${response.statusText}.`);
    }

    return response.json();
}

export { kitsuFetch, KitsuUserNotFoundError };
