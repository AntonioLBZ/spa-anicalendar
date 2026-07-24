import { describe, expect, it } from 'vitest';

import { selectAnimeEntry } from '../media-list.selector';

import type { DenormalizedEntry } from '../media-list.selector';
import type { KitsuAnimeResource, KitsuCategory, KitsuLibraryEntry } from '../media-list.types';
import type { AiringInfo } from '@/services/models';

function baseEntry(overrides: Partial<KitsuLibraryEntry['attributes']> = {}): KitsuLibraryEntry {
    return {
        type: 'libraryEntries',
        id: '1',
        attributes: {
            status: 'current',
            progress: 5,
            reconsumeCount: 0,
            ...overrides,
        },
        relationships: { anime: { data: { type: 'anime', id: '10' } } },
    };
}

function baseAnime(overrides: Partial<KitsuAnimeResource['attributes']> = {}, id = '10'): KitsuAnimeResource {
    return {
        type: 'anime',
        id,
        attributes: {
            canonicalTitle: 'Test Anime',
            slug: 'test-anime',
            status: 'finished',
            endDate: null,
            ...overrides,
        },
    };
}

function denormalized(overrides: Partial<DenormalizedEntry> = {}): DenormalizedEntry {
    return {
        entry: baseEntry(),
        anime: baseAnime(),
        categories: [],
        malId: undefined,
        ...overrides,
    };
}

const NO_AIRING: Record<number, AiringInfo> = {};

describe('selectAnimeEntry', () => {
    it('maps finished to FINISHED', () => {
        const entry = selectAnimeEntry(denormalized({ anime: baseAnime({ status: 'finished' }) }), NO_AIRING);

        expect(entry.status).toBe('FINISHED');
    });

    it('maps current to RELEASING', () => {
        const entry = selectAnimeEntry(denormalized({ anime: baseAnime({ status: 'current' }) }), NO_AIRING);

        expect(entry.status).toBe('RELEASING');
    });

    it('maps upcoming and tba to NOT_YET_RELEASED', () => {
        expect(selectAnimeEntry(denormalized({ anime: baseAnime({ status: 'upcoming' }) }), NO_AIRING).status).toBe(
            'NOT_YET_RELEASED',
        );
        expect(selectAnimeEntry(denormalized({ anime: baseAnime({ status: 'tba' }) }), NO_AIRING).status).toBe('NOT_YET_RELEASED');
    });

    it('falls back to NOT_YET_RELEASED for an unknown status without throwing', () => {
        const anime = baseAnime({ status: 'current' });
        // @ts-expect-error deliberately testing an unmapped status value
        anime.attributes.status = 'unknown_status';

        expect(() => selectAnimeEntry(denormalized({ anime }), NO_AIRING)).not.toThrow();
        expect(selectAnimeEntry(denormalized({ anime }), NO_AIRING).status).toBe('NOT_YET_RELEASED');
    });

    it('sets nextAiringEpisode from the AniList lookup keyed by the resolved MAL id, not the Kitsu anime id', () => {
        // Kitsu anime id (10001) is deliberately different from its mapped MAL id (42) — these are
        // independent id namespaces and must not be conflated (see media-list.query.ts:getMalIdsForAnime).
        const anime = baseAnime({ status: 'current' }, '10001');
        const entry = selectAnimeEntry(denormalized({ anime, malId: 42 }), {
            42: { nextAiringEpisode: { airingAt: 1784124000, episode: 11 }, season: 'FALL', seasonYear: 2024 },
        });

        expect(entry.nextAiringEpisode).toEqual({ airingAt: 1784124000, episode: 11 });
    });

    it('omits nextAiringEpisode when current but there is no resolved MAL id for this anime', () => {
        const anime = baseAnime({ status: 'current' }, '10001');
        const entry = selectAnimeEntry(denormalized({ anime, malId: undefined }), { 42: { airingAt: 1784124000, episode: 11 } });

        expect(entry.nextAiringEpisode).toBeUndefined();
    });

    it('omits nextAiringEpisode when current but the lookup has no entry for the resolved MAL id', () => {
        const anime = baseAnime({ status: 'current' }, '10001');
        const entry = selectAnimeEntry(denormalized({ anime, malId: 99 }), NO_AIRING);

        expect(entry.nextAiringEpisode).toBeUndefined();
    });

    it('omits nextAiringEpisode when status is not current even if the lookup has an entry for the resolved MAL id', () => {
        const anime = baseAnime({ status: 'finished' }, '10001');
        const entry = selectAnimeEntry(denormalized({ anime, malId: 42 }), { 42: { airingAt: 1784124000, episode: 11 } });

        expect(entry.nextAiringEpisode).toBeUndefined();
    });

    it('maps ageRating R18 to isAdult true, anything else to false', () => {
        expect(selectAnimeEntry(denormalized({ anime: baseAnime({ ageRating: 'R18' }) }), NO_AIRING).isAdult).toBe(true);
        expect(selectAnimeEntry(denormalized({ anime: baseAnime({ ageRating: 'PG' }) }), NO_AIRING).isAdult).toBe(false);
        expect(selectAnimeEntry(denormalized({ anime: baseAnime({ ageRating: undefined }) }), NO_AIRING).isAdult).toBe(false);
    });

    it('parses endDate variants into PartialDate, null into {}', () => {
        expect(selectAnimeEntry(denormalized({ anime: baseAnime({ endDate: '2025-12-19' }) }), NO_AIRING).endDate).toEqual({
            year: 2025,
            month: 12,
            day: 19,
        });
        expect(selectAnimeEntry(denormalized({ anime: baseAnime({ endDate: null }) }), NO_AIRING).endDate).toEqual({});
    });

    it('leaves season always undefined', () => {
        expect(selectAnimeEntry(denormalized(), NO_AIRING).season).toBeUndefined();
    });

    it('maps genres from included categories, defaulting to [] when absent', () => {
        const categories: KitsuCategory[] = [
            { type: 'categories', id: '1', attributes: { title: 'Action' } },
            { type: 'categories', id: '2', attributes: { title: 'Adventure' } },
        ];

        expect(selectAnimeEntry(denormalized({ categories }), NO_AIRING).genres).toEqual(['Action', 'Adventure']);
        expect(selectAnimeEntry(denormalized({ categories: [] }), NO_AIRING).genres).toEqual([]);
    });

    it('maps progress and reconsumeCount to progress/repeat, defaulting repeat to 0', () => {
        const entry = selectAnimeEntry(
            denormalized({ entry: baseEntry({ progress: 7, reconsumeCount: 2 }) }),
            NO_AIRING,
        );

        expect(entry.progress).toBe(7);
        expect(entry.repeat).toBe(2);
    });

    it('maps id from the library entry and mediaId from the anime resource', () => {
        const entry = selectAnimeEntry(
            denormalized({ entry: baseEntry(), anime: baseAnime({}, '77') }),
            NO_AIRING,
        );

        expect(entry.id).toBe(1);
        expect(entry.mediaId).toBe(77);
    });

    it('maps coverImageUrl, falling back from large to medium to empty string', () => {
        expect(
            selectAnimeEntry(
                denormalized({ anime: baseAnime({ posterImage: { medium: 'med.jpg', large: 'large.jpg' } }) }),
                NO_AIRING,
            ).coverImageUrl,
        ).toBe('large.jpg');
        expect(
            selectAnimeEntry(denormalized({ anime: baseAnime({ posterImage: { medium: 'med.jpg' } }) }), NO_AIRING).coverImageUrl,
        ).toBe('med.jpg');
        expect(selectAnimeEntry(denormalized({ anime: baseAnime({ posterImage: null }) }), NO_AIRING).coverImageUrl).toBe('');
    });

    it('builds siteUrl from the anime slug', () => {
        expect(selectAnimeEntry(denormalized({ anime: baseAnime({ slug: 'my-anime' }) }), NO_AIRING).siteUrl).toBe(
            'https://kitsu.app/anime/my-anime',
        );
    });

    it('maps each subtype value to the correct format enum', () => {
        const subtypeTests: Array<[string, string]> = [
            ['TV', 'TV'],
            ['movie', 'MOVIE'],
            ['OVA', 'OVA'],
            ['ONA', 'ONA'],
            ['special', 'SPECIAL'],
            ['music', 'MUSIC'],
        ];

        subtypeTests.forEach(([subtype, expectedFormat]) => {
            const entry = selectAnimeEntry(denormalized({ anime: baseAnime({ subtype }) }), NO_AIRING);
            expect(entry.format).toBe(expectedFormat);
        });
    });

    it('maps unknown subtype to undefined without throwing', () => {
        const entry = selectAnimeEntry(denormalized({ anime: baseAnime({ subtype: 'unknown_subtype' }) }), NO_AIRING);
        expect(entry.format).toBeUndefined();
    });

    it('maps null subtype to undefined', () => {
        const entry = selectAnimeEntry(denormalized({ anime: baseAnime({ subtype: null }) }), NO_AIRING);
        expect(entry.format).toBeUndefined();
    });

    describe('listStatus mapping (which requested list this entry came from)', () => {
        it('maps current (library status) to WATCHING', () => {
            const entry = selectAnimeEntry(denormalized({ entry: baseEntry({ status: 'current' }) }), NO_AIRING);
            expect(entry.listStatus).toBe('WATCHING');
        });

        it('maps planned to PLANNING', () => {
            const entry = selectAnimeEntry(denormalized({ entry: baseEntry({ status: 'planned' }) }), NO_AIRING);
            expect(entry.listStatus).toBe('PLANNING');
        });

        it('leaves listStatus undefined for an unmapped library status', () => {
            const entry = selectAnimeEntry(denormalized({ entry: baseEntry({ status: 'completed' }) }), NO_AIRING);
            expect(entry.listStatus).toBeUndefined();
        });
    });
});
