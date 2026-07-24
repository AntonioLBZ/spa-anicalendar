import { parseEndDate } from '../../shared';

import type { KitsuAnimeResource, KitsuCategory, KitsuLibraryEntry } from './media-list.types';
import type { AiringInfo, AnimeEntry, MediaFormat, MediaListEntryStatus, MediaSeason, MediaStatus } from '@/services/models';

// Kitsu's status enum has no equivalent to CANCELLED/HIATUS, so those AniList-only values never appear here.
const STATUS_MAP: Record<string, MediaStatus> = {
    current: 'RELEASING',
    finished: 'FINISHED',
    upcoming: 'NOT_YET_RELEASED',
    tba: 'NOT_YET_RELEASED',
};

// entry.attributes.status is the library-membership status (which requested list this came from).
const LIST_STATUS_MAP: Record<string, MediaListEntryStatus> = {
    current: 'WATCHING',
    planned: 'PLANNING',
};

const FORMAT_MAP: Record<string, MediaFormat> = {
    TV: 'TV',
    movie: 'MOVIE',
    OVA: 'OVA',
    ONA: 'ONA',
    special: 'SPECIAL',
    music: 'MUSIC',
};

interface DenormalizedEntry {
    entry: KitsuLibraryEntry;
    anime: KitsuAnimeResource;
    categories: KitsuCategory[];
    malId: number | undefined;
}

type WrappedAiring = { nextAiringEpisode?: AiringInfo; season?: MediaSeason; seasonYear?: number };
type MalAiringLookupValue = AiringInfo | WrappedAiring;

// Older callers/tests pass a raw AiringInfo (no season data); newer ones pass the wrapped shape.
function isWrappedAiring(value: MalAiringLookupValue): value is WrappedAiring {
    return !('airingAt' in value);
}

const selectAnimeEntry = (
    { entry, anime, categories, malId }: DenormalizedEntry,
    nextAiringByMalId: Record<number, MalAiringLookupValue> = {},
    nextAiringByAnilistId: Record<number, WrappedAiring> = {},
    anilistIdByAnimeId: Map<string, number> = new Map(),
): AnimeEntry => {
    const isCurrentlyAiring = anime.attributes.status === 'current';
    const malLookup = malId !== undefined ? nextAiringByMalId[malId] : undefined;
    const nextAiringEpisode =
        isCurrentlyAiring && malLookup !== undefined && isWrappedAiring(malLookup) ? malLookup.nextAiringEpisode : undefined;

    let season: MediaSeason | undefined;
    let seasonYear: number | undefined;

    if (malLookup !== undefined) {
        if (isWrappedAiring(malLookup)) {
            season = malLookup.season;
            seasonYear = malLookup.seasonYear;
        }
    } else {
        const anilistId = anilistIdByAnimeId.get(anime.id);
        if (anilistId !== undefined && nextAiringByAnilistId[anilistId]) {
            season = nextAiringByAnilistId[anilistId].season;
            seasonYear = nextAiringByAnilistId[anilistId].seasonYear;
        }
    }

    return {
        id: Number(entry.id),
        mediaId: Number(anime.id),
        title: anime.attributes.canonicalTitle,
        coverImageUrl: anime.attributes.posterImage?.large ?? anime.attributes.posterImage?.medium ?? '',
        episodes: anime.attributes.episodeCount ?? undefined,
        duration: anime.attributes.episodeLength ?? undefined,
        status: STATUS_MAP[anime.attributes.status] ?? 'NOT_YET_RELEASED',
        nextAiringEpisode,
        siteUrl: `https://kitsu.io/anime/${anime.attributes.slug}`,
        endDate: parseEndDate(anime.attributes.endDate),
        isAdult: anime.attributes.ageRating === 'R18',
        season,
        seasonYear,
        format: anime.attributes.subtype ? FORMAT_MAP[anime.attributes.subtype] : undefined,
        listStatus: LIST_STATUS_MAP[entry.attributes.status],
        genres: categories.map((category) => category.attributes.title),
        progress: entry.attributes.progress,
        repeat: entry.attributes.reconsumeCount ?? 0,
    };
};

const selectAnimeEntries = (
    entries: DenormalizedEntry[],
    nextAiringByMalId: Record<number, MalAiringLookupValue> = {},
    nextAiringByAnilistId: Record<number, WrappedAiring> = {},
    anilistIdByAnimeId: Map<string, number> = new Map(),
): AnimeEntry[] => entries.map((entry) => selectAnimeEntry(entry, nextAiringByMalId, nextAiringByAnilistId, anilistIdByAnimeId));

export { selectAnimeEntries, selectAnimeEntry };
export type { DenormalizedEntry };
