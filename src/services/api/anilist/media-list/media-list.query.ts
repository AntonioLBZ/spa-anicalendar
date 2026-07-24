import { anilistQuery } from '../client';
import { selectAnimeEntries } from './media-list.selector';

import type {
    AnilistCandidateMediaResponse,
    AnilistCandidateMediaVariables,
    AnilistMediaListEntry,
    AnilistMediaListResponse,
    AnilistMediaListVariables,
    GetCandidateMediaIdsParams,
    GetMediaListParams,
} from './media-list.types';
import type { AnimeEntry } from '@/services/models';

const GET_MEDIA_LIST = `
query MediaList($userId: Int, $type: MediaType, $statusIn: [MediaListStatus], $mediaIdIn: [Int], $sort: [MediaListSort], $page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      hasNextPage
    }
    mediaList(userId: $userId, type: $type, status_in: $statusIn, mediaId_in: $mediaIdIn, sort: $sort) {
      id
      status
      media {
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
        format
        genres
      }
      progress
      mediaId
      repeat
    }
  }
}
`;

// AniList's mediaList connection is capped at 50 items per page, so large lists must be paged
// through in full. MAX_PAGES is a safety net against a runaway/misbehaving API.
const PAGE_SIZE = 50;
const MAX_PAGES = 5;

async function paginate<TItem>(
    maxPages: number,
    fetchPage: (page: number) => Promise<{ items: TItem[]; hasNextPage: boolean }>
): Promise<TItem[]> {
    const allItems: TItem[] = [];
    let page = 1;
    let hasNextPage = true;

    while (hasNextPage && page <= maxPages) {
        const result = await fetchPage(page);
        allItems.push(...result.items);
        hasNextPage = result.hasNextPage;
        page += 1;
    }

    return allItems;
}

async function getMediaList(params: GetMediaListParams): Promise<AnimeEntry[]> {
    if (params.mediaIdIn && params.mediaIdIn.length === 0) {
        return [];
    }

    const allEntries = await paginate<AnilistMediaListEntry>(MAX_PAGES, async (page) => {
        const response = await anilistQuery<AnilistMediaListResponse, AnilistMediaListVariables>(GET_MEDIA_LIST, {
            ...params,
            page,
            perPage: PAGE_SIZE,
        });

        if (response.errors) {
            throw new Error(response.errors[0].message);
        }

        return { items: response.data.Page.mediaList, hasNextPage: response.data.Page.pageInfo.hasNextPage };
    });

    return selectAnimeEntries(allEntries);
}

// Id-only lookup against AniList's public media catalog, which supports season/status/format
// filtering server-side (unlike the mediaList query). Used to build a bounded candidate id set
// for the "planning" fetch. Sorted by popularity, capped at CANDIDATE_MAX_PAGES pages.
const GET_CANDIDATE_MEDIA_IDS = `
query CandidateMediaIds($season: MediaSeason, $seasonYear: Int, $status: MediaStatus, $formatIn: [MediaFormat], $type: MediaType, $page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      hasNextPage
    }
    media(season: $season, seasonYear: $seasonYear, status: $status, format_in: $formatIn, type: $type, sort: POPULARITY_DESC) {
      id
    }
  }
}
`;

const CANDIDATE_MAX_PAGES = 2;

async function getCandidateMediaIds(params: GetCandidateMediaIdsParams): Promise<number[]> {
    return paginate<number>(CANDIDATE_MAX_PAGES, async (page) => {
        const variables: AnilistCandidateMediaVariables = {
            season: params.season,
            seasonYear: params.seasonYear,
            status: params.status,
            type: 'ANIME',
            page,
            perPage: PAGE_SIZE,
            ...(params.formats && params.formats.length > 0 ? { formatIn: params.formats } : {}),
        };

        const response = await anilistQuery<AnilistCandidateMediaResponse, AnilistCandidateMediaVariables>(
            GET_CANDIDATE_MEDIA_IDS,
            variables
        );

        if (response.errors) {
            throw new Error(response.errors[0].message);
        }

        return {
            items: response.data.Page.media.map((media) => media.id),
            hasNextPage: response.data.Page.pageInfo.hasNextPage,
        };
    });
}

export { getMediaList, getCandidateMediaIds };
export type { GetMediaListParams };
