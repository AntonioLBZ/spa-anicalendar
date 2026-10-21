import { anilistQuery } from '../anilist/client';

import type { AiringInfo, MediaSeason } from '@/services/models';

// AniList's Page connection hard-caps perPage at 50, so larger id sets must be chunked.
const ANILIST_PAGE_SIZE_CAP = 50;

function chunk<T>(items: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < items.length; i += size) {
        chunks.push(items.slice(i, i + size));
    }
    return chunks;
}

type AiringLookupEntry = {
    nextAiringEpisode?: AiringInfo;
    season?: MediaSeason;
    seasonYear?: number;
    coverColor?: string;
};
type AiringLookupResult = Record<number, AiringLookupEntry>;

interface AiringLookupMedia {
    nextAiringEpisode: AiringInfo | null;
    season: MediaSeason | null;
    seasonYear: number | null;
    coverImage: { color: string | null } | null;
}

interface AiringLookupResponse<TMedia extends AiringLookupMedia> {
    Page: { media: TMedia[] };
}

async function fetchAiringLookup<TMedia extends AiringLookupMedia>(
    ids: number[],
    query: string,
    idsVariableName: string,
    getKey: (media: TMedia) => number | null
): Promise<AiringLookupResult> {
    if (ids.length === 0) {
        return {};
    }

    const responses = await Promise.all(
        chunk(ids, ANILIST_PAGE_SIZE_CAP).map((idsChunk) =>
            anilistQuery<AiringLookupResponse<TMedia>, Record<string, unknown>>(query, {
                [idsVariableName]: idsChunk,
                perPage: idsChunk.length,
            })
        )
    );

    const result: AiringLookupResult = {};

    for (const response of responses) {
        // A partial lookup would silently move airing shows to "No upcoming episodes", so fail the whole list
        if (response.errors) {
            throw new Error(`AniList airing lookup error: ${response.errors[0].message}`);
        }

        for (const media of response.data.Page.media) {
            const key = getKey(media);
            if (key !== null) {
                result[key] = {
                    nextAiringEpisode: media.nextAiringEpisode ?? undefined,
                    season: media.season ?? undefined,
                    seasonYear: media.seasonYear ?? undefined,
                    coverColor: media.coverImage?.color ?? undefined,
                };
            }
        }
    }

    return result;
}

interface AnilistAiringByMalIdMedia extends AiringLookupMedia {
    idMal: number | null;
}

const GET_NEXT_AIRING_BY_MAL_ID = `
query NextAiringByMalId($idMalIn: [Int], $perPage: Int) {
  Page(perPage: $perPage) {
    media(idMal_in: $idMalIn, type: ANIME) {
      idMal
      nextAiringEpisode {
        airingAt
        episode
      }
      season
      seasonYear
      coverImage {
        color
      }
    }
  }
}
`;

async function getNextAiringByMalIds(malIds: number[]): Promise<AiringLookupResult> {
    return fetchAiringLookup<AnilistAiringByMalIdMedia>(
        malIds,
        GET_NEXT_AIRING_BY_MAL_ID,
        'idMalIn',
        (media) => media.idMal
    );
}

interface AnilistAiringByIdMedia extends AiringLookupMedia {
    id: number;
}

const GET_NEXT_AIRING_BY_ANILIST_ID = `
query NextAiringByAnilistId($idIn: [Int], $perPage: Int) {
  Page(perPage: $perPage) {
    media(id_in: $idIn, type: ANIME) {
      id
      nextAiringEpisode {
        airingAt
        episode
      }
      season
      seasonYear
      coverImage {
        color
      }
    }
  }
}
`;

/**
 * Fallback lookup keyed by AniList id itself (not idMal), for media that only have an
 * AniList crossreference on the source provider (e.g. Kitsu's community mappings frequently
 * lack a MyAnimeList crossreference for newer/niche titles even when an AniList one exists).
 */
async function getNextAiringByAnilistIds(anilistIds: number[]): Promise<AiringLookupResult> {
    return fetchAiringLookup<AnilistAiringByIdMedia>(
        anilistIds,
        GET_NEXT_AIRING_BY_ANILIST_ID,
        'idIn',
        (media) => media.id
    );
}

export { getNextAiringByMalIds, getNextAiringByAnilistIds };
