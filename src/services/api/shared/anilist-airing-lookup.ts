import { anilistQuery } from '../anilist/client';

import type { AiringInfo, MediaSeason } from '@/services/models';

// AniList's Page connection hard-caps perPage at 50 — callers with larger id sets (e.g. Kitsu's
// fully-paginated planning lists) must be chunked, or ids beyond the 50th are silently dropped
// from the lookup instead of erroring, meaning some entries would just be missing enrichment data.
const ANILIST_PAGE_SIZE_CAP = 50;

function chunk<T>(items: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < items.length; i += size) {
        chunks.push(items.slice(i, i + size));
    }
    return chunks;
}

interface AnilistAiringLookupResponse {
    Page: {
        media: Array<{
            idMal: number | null;
            nextAiringEpisode: AiringInfo | null;
            season: MediaSeason | null;
            seasonYear: number | null;
        }>;
    };
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
    }
  }
}
`;

async function getNextAiringByMalIds(
    malIds: number[],
): Promise<Record<number, { nextAiringEpisode?: AiringInfo; season?: MediaSeason; seasonYear?: number }>> {
    if (malIds.length === 0) {
        return {};
    }

    try {
        const responses = await Promise.all(
            chunk(malIds, ANILIST_PAGE_SIZE_CAP).map((idMalIn) =>
                anilistQuery<AnilistAiringLookupResponse>(GET_NEXT_AIRING_BY_MAL_ID, {
                    idMalIn,
                    perPage: idMalIn.length,
                }),
            ),
        );

        const result: Record<number, { nextAiringEpisode?: AiringInfo; season?: MediaSeason; seasonYear?: number }> =
            {};

        for (const response of responses) {
            if (response.errors) {
                console.error(`AniList airing lookup error: ${response.errors[0].message}`);
                continue;
            }

            for (const media of response.data.Page.media) {
                if (media.idMal !== null) {
                    result[media.idMal] = {
                        nextAiringEpisode: media.nextAiringEpisode ?? undefined,
                        season: media.season ?? undefined,
                        seasonYear: media.seasonYear ?? undefined,
                    };
                }
            }
        }

        return result;
    } catch (error) {
        console.error('AniList airing lookup failed:', error);
        return {};
    }
}

interface AnilistAiringByIdLookupResponse {
    Page: {
        media: Array<{
            id: number;
            nextAiringEpisode: AiringInfo | null;
            season: MediaSeason | null;
            seasonYear: number | null;
        }>;
    };
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
    }
  }
}
`;

/**
 * Fallback lookup keyed by AniList id itself (not idMal), for media that only have an
 * AniList crossreference on the source provider (e.g. Kitsu's community mappings frequently
 * lack a MyAnimeList crossreference for newer/niche titles even when an AniList one exists).
 */
async function getNextAiringByAnilistIds(
    anilistIds: number[],
): Promise<Record<number, { nextAiringEpisode?: AiringInfo; season?: MediaSeason; seasonYear?: number }>> {
    if (anilistIds.length === 0) {
        return {};
    }

    try {
        const responses = await Promise.all(
            chunk(anilistIds, ANILIST_PAGE_SIZE_CAP).map((idIn) =>
                anilistQuery<AnilistAiringByIdLookupResponse>(GET_NEXT_AIRING_BY_ANILIST_ID, {
                    idIn,
                    perPage: idIn.length,
                }),
            ),
        );

        const result: Record<number, { nextAiringEpisode?: AiringInfo; season?: MediaSeason; seasonYear?: number }> =
            {};

        for (const response of responses) {
            if (response.errors) {
                console.error(`AniList airing lookup error: ${response.errors[0].message}`);
                continue;
            }

            for (const media of response.data.Page.media) {
                result[media.id] = {
                    nextAiringEpisode: media.nextAiringEpisode ?? undefined,
                    season: media.season ?? undefined,
                    seasonYear: media.seasonYear ?? undefined,
                };
            }
        }

        return result;
    } catch (error) {
        console.error('AniList airing lookup failed:', error);
        return {};
    }
}

export { getNextAiringByMalIds, getNextAiringByAnilistIds };
