
import { anilistQuery } from '../client';
import { selectAnimeEntries } from './media-list.selector';

import type { AnilistMediaListResponse, AnilistMediaListVariables, GetMediaListParams } from './media-list.types';
import type { AnimeEntry } from '@/services/models';

const GET_MEDIA_LIST = `
query MediaList($userId: Int, $type: MediaType, $statusIn: [MediaListStatus], $sort: [MediaListSort]) {
  Page {
    mediaList(userId: $userId, type: $type, status_in: $statusIn, sort: $sort) {
      id
      media {
        coverImage {
          medium
        }
        chapters
        episodes
        status
        nextAiringEpisode {
          airingAt
          episode
        }
        siteUrl
        title {
          userPreferred
        }
        endDate {
          day
          month
          year
        }
        isAdult
        season
        genres
      }
      progress
      mediaId
      repeat
    }
  }
}
`;

async function getMediaList(params: GetMediaListParams): Promise<AnimeEntry[]> {
    const response = await anilistQuery<AnilistMediaListResponse, AnilistMediaListVariables>(GET_MEDIA_LIST, params);

    if (response.errors) {
        throw new Error(response.errors[0].message);
    }

    return selectAnimeEntries(response.data.Page.mediaList);
}

export { getMediaList };
export type { GetMediaListParams };
