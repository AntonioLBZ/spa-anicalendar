class MalUserNotFoundError extends Error {}

async function malFetch<T>(path: string): Promise<T> {
    const response = await fetch(`/api/mal${path}`);

    if (!response.ok) {
        if (response.status === 404) {
            throw new MalUserNotFoundError(`MAL API error: ${response.status} ${response.statusText}.`);
        }
        throw new Error(`MAL API error: ${response.status} ${response.statusText}.`);
    }

    return response.json();
}

export { malFetch, MalUserNotFoundError };
