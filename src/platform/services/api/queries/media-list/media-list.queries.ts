import { anilistQuery } from '../../anilist-client';
import {
    IGetMediaListResponse,
    IGetMediaListVariables,
    IMediaListEntry,
    IGetMediaListParams,
} from './media-list.types';

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
      }
      progress
      mediaId
      repeat
    }
  }
}
`;

async function getMediaList(
    params: IGetMediaListParams
): Promise<IMediaListEntry[]> {
    const response = await anilistQuery<
        IGetMediaListResponse,
        IGetMediaListVariables
    >(GET_MEDIA_LIST, params);

    if (response.errors) {
        throw new Error(response.errors[0].message);
    }

    return response.data.Page.mediaList;
}

export { getMediaList };
export type { IGetMediaListParams };
