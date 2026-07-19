import { anilistQuery } from '../client';
import { selectSeasonalEntries } from './seasonal.selector';

import type { AnilistSeasonalResponse, AnilistSeasonalVariables, GetSeasonalMediaParams } from './seasonal.types';
import type { AnimeEntry } from '@/services/models';

const GET_SEASONAL_MEDIA = `
query Seasonal($season: MediaSeason, $seasonYear: Int, $type: MediaType, $format_in: [MediaFormat], $status: MediaStatus, $sort: [MediaSort], $perPage: Int) {
  Page(page: 1, perPage: $perPage) {
    media(season: $season, seasonYear: $seasonYear, type: $type, format_in: $format_in, status: $status, sort: $sort) {
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
      seasonYear
      genres
    }
  }
}
`;

const ANILIST_MAX_PER_PAGE = 50;

async function getSeasonalMedia(params: GetSeasonalMediaParams): Promise<AnimeEntry[]> {
    const variables: AnilistSeasonalVariables = {
        ...((params.onlyNewSeason ?? false) ? { season: params.season, seasonYear: params.seasonYear } : {}),
        type: 'ANIME',
        status: 'RELEASING',
        sort: ['POPULARITY_DESC'],
        perPage: Math.min(params.perPage ?? ANILIST_MAX_PER_PAGE, ANILIST_MAX_PER_PAGE),
        ...(params.formats && params.formats.length > 0 ? { format_in: params.formats } : {}),
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
