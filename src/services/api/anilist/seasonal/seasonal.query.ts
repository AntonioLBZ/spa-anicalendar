import { anilistQuery } from '../client';
import { selectSeasonalEntries } from './seasonal.selector';

import type { AnilistSeasonalResponse, AnilistSeasonalVariables, GetSeasonalMediaParams } from './seasonal.types';
import type { AnimeEntry } from '@/services/models';

const GET_SEASONAL_MEDIA = `
query Seasonal($season: MediaSeason, $seasonYear: Int, $type: MediaType, $format: MediaFormat, $status: MediaStatus, $sort: [MediaSort]) {
  Page(page: 1, perPage: 50) {
    media(season: $season, seasonYear: $seasonYear, type: $type, format: $format, status: $status, sort: $sort) {
      id
      coverImage {
        medium
        large
      }
      chapters
      episodes
      duration
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
  }
}
`;

async function getSeasonalMedia(params: GetSeasonalMediaParams): Promise<AnimeEntry[]> {
    const variables: AnilistSeasonalVariables = {
        season: params.season,
        seasonYear: params.seasonYear,
        type: 'ANIME',
        format: 'TV',
        status: 'RELEASING',
        sort: ['POPULARITY_DESC'],
    };

    const response = await anilistQuery<AnilistSeasonalResponse, AnilistSeasonalVariables>(
        GET_SEASONAL_MEDIA,
        variables
    );

    if (response.errors) {
        throw new Error(response.errors[0].message);
    }

    return selectSeasonalEntries(response.data.Page.media);
}

export { getSeasonalMedia };
export type { GetSeasonalMediaParams };
