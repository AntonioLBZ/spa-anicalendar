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

// AniList's mediaList connection is capped at 50 items per page — accounts with large lists
// (e.g. a big "planning" backlog) need to be paged through in full, or entries silently go
// missing past the first page. Cap the loop as a safety net against a runaway/misbehaving API.
const PAGE_SIZE = 50;
const MAX_PAGES = 40; // 40 * 50 = 2000 entries, comfortably above any real user's list size

async function getMediaList(params: GetMediaListParams): Promise<AnimeEntry[]> {
    // A `planning` list can be enormous (hundreds of entries) with almost none of it relevant to
    // a weekly calendar — when the caller already narrowed the request to a bounded candidate set
    // via mediaId_in (see getCandidateMediaIds below), skip the request entirely if that set is
    // empty, rather than issuing a query AniList would answer with zero results anyway.
    if (params.mediaIdIn && params.mediaIdIn.length === 0) {
        return [];
    }

    const allEntries: AnilistMediaListEntry[] = [];
    let page = 1;
    let hasNextPage = true;

    while (hasNextPage && page <= MAX_PAGES) {
        const response = await anilistQuery<AnilistMediaListResponse, AnilistMediaListVariables>(GET_MEDIA_LIST, {
            ...params,
            page,
            perPage: PAGE_SIZE,
        });

        if (response.errors) {
            throw new Error(response.errors[0].message);
        }

        allEntries.push(...response.data.Page.mediaList);
        hasNextPage = response.data.Page.pageInfo.hasNextPage;
        page += 1;
    }

    return selectAnimeEntries(allEntries);
}

// Lightweight id-only lookup against AniList's public media catalog (Page.media), which DOES
// support season/seasonYear/status/format filtering server-side (unlike Page.mediaList, which has
// no such filter — confirmed via introspection: MediaList.media has no filter args, and
// Media.mediaListEntry takes no userId, so it only works for an authenticated viewer, not an
// arbitrary public user). Used to build a bounded mediaId_in candidate set for the "planning"
// fetch, so we never have to pull an entire (potentially huge) planning backlog just to find
// the handful of entries that are actually airing/premiering/finishing this season. Sorted by
// popularity, capped at CANDIDATE_MAX_PAGES pages — a real user's "planning" backlog often
// includes less-popular titles that a single top-50 page would miss, so a couple of pages gives
// meaningfully better coverage without risking the catalog-sized (thousands of results) blowup
// this replaced.
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

const CANDIDATE_MAX_PAGES = 2; // 2 * 50 = 100 candidates cap

async function getCandidateMediaIds(params: GetCandidateMediaIdsParams): Promise<number[]> {
    const ids: number[] = [];
    let page = 1;
    let hasNextPage = true;

    while (hasNextPage && page <= CANDIDATE_MAX_PAGES) {
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
            variables,
        );

        if (response.errors) {
            throw new Error(response.errors[0].message);
        }

        ids.push(...response.data.Page.media.map((media) => media.id));
        hasNextPage = response.data.Page.pageInfo.hasNextPage;
        page += 1;
    }

    return ids;
}

export { getMediaList, getCandidateMediaIds };
export type { GetMediaListParams };
