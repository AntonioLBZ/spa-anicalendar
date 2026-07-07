const ANILIST_API_URL = 'https://graphql.anilist.co';

interface GraphQLResponse<T> {
    data: T;
    errors?: Array<{
        message: string;
        locations?: Array<{ line: number; column: number }>;
        path?: string[];
    }>;
}

async function anilistQuery<T, V = Record<string, unknown>>(query: string, variables?: V): Promise<GraphQLResponse<T>> {
    const response = await fetch(ANILIST_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({
            query,
            variables,
        }),
    });

    if (!response.ok) {
        throw new Error(`AniList API error: ${response.status} ${response.statusText}.`);
    }

    return response.json();
}

export { anilistQuery };
export type { GraphQLResponse };
