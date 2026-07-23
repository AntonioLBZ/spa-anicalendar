import { anilistQuery } from '../anilist/client';

import type { AiringInfo, MediaSeason } from '@/services/models';

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
        const response = await anilistQuery<AnilistAiringLookupResponse>(GET_NEXT_AIRING_BY_MAL_ID, {
            idMalIn: malIds,
            perPage: malIds.length,
        });

        if (response.errors) {
            console.error(`AniList airing lookup error: ${response.errors[0].message}`);
            return {};
        }

        const result: Record<number, { nextAiringEpisode?: AiringInfo; season?: MediaSeason; seasonYear?: number }> =
            {};

        for (const media of response.data.Page.media) {
            if (media.idMal !== null) {
                result[media.idMal] = {
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
        const response = await anilistQuery<AnilistAiringByIdLookupResponse>(GET_NEXT_AIRING_BY_ANILIST_ID, {
            idIn: anilistIds,
            perPage: anilistIds.length,
        });

        if (response.errors) {
            console.error(`AniList airing lookup error: ${response.errors[0].message}`);
            return {};
        }

        const result: Record<number, { nextAiringEpisode?: AiringInfo; season?: MediaSeason; seasonYear?: number }> =
            {};

        for (const media of response.data.Page.media) {
            result[media.id] = {
                nextAiringEpisode: media.nextAiringEpisode ?? undefined,
                season: media.season ?? undefined,
                seasonYear: media.seasonYear ?? undefined,
            };
        }

        return result;
    } catch (error) {
        console.error('AniList airing lookup failed:', error);
        return {};
    }
}

export { getNextAiringByMalIds, getNextAiringByAnilistIds };
