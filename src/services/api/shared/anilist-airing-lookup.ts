import { anilistQuery } from '../anilist/client';

import type { AiringInfo } from '@/services/models';

interface AnilistAiringLookupResponse {
    Page: {
        media: Array<{
            idMal: number | null;
            nextAiringEpisode: AiringInfo | null;
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
    }
  }
}
`;

async function getNextAiringByMalIds(malIds: number[]): Promise<Record<number, AiringInfo>> {
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

        const result: Record<number, AiringInfo> = {};

        for (const media of response.data.Page.media) {
            if (media.idMal !== null && media.nextAiringEpisode) {
                result[media.idMal] = media.nextAiringEpisode;
            }
        }

        return result;
    } catch (error) {
        console.error('AniList airing lookup failed:', error);
        return {};
    }
}

export { getNextAiringByMalIds };
