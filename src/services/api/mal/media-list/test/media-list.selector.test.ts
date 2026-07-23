import { describe, expect, it } from 'vitest';

import { selectAnimeEntry } from '../media-list.selector';

import type { MalAnimeListEntry } from '../media-list.types';
import type { AiringInfo } from '@/services/models';

function baseNode(overrides: Partial<MalAnimeListEntry['node']> = {}): MalAnimeListEntry['node'] {
    return {
        id: 1,
        title: 'Test Anime',
        status: 'finished_airing',
        media_type: 'tv',
        ...overrides,
    };
}

function baseListStatus(overrides: Partial<MalAnimeListEntry['list_status']> = {}): MalAnimeListEntry['list_status'] {
    return {
        status: 'watching',
        score: 0,
        num_episodes_watched: 5,
        is_rewatching: false,
        updated_at: '2026-01-01T00:00:00+00:00',
        ...overrides,
    };
}

const NO_AIRING: Record<number, AiringInfo> = {};

describe('selectAnimeEntry', () => {
    it('maps finished_airing to FINISHED', () => {
        const entry = selectAnimeEntry({ node: baseNode({ status: 'finished_airing' }), list_status: baseListStatus() }, NO_AIRING);

        expect(entry.status).toBe('FINISHED');
    });

    it('maps currently_airing to RELEASING', () => {
        const entry = selectAnimeEntry({ node: baseNode({ status: 'currently_airing' }), list_status: baseListStatus() }, NO_AIRING);

        expect(entry.status).toBe('RELEASING');
    });

    it('maps not_yet_aired to NOT_YET_RELEASED', () => {
        const entry = selectAnimeEntry({ node: baseNode({ status: 'not_yet_aired' }), list_status: baseListStatus() }, NO_AIRING);

        expect(entry.status).toBe('NOT_YET_RELEASED');
    });

    it('sets nextAiringEpisode from the AniList lookup when currently_airing and present', () => {
        const entry = selectAnimeEntry(
            { node: baseNode({ id: 42, status: 'currently_airing' }), list_status: baseListStatus() },
            { 42: { airingAt: 1784124000, episode: 11 } },
        );

        expect(entry.nextAiringEpisode).toEqual({ airingAt: 1784124000, episode: 11 });
    });

    it('omits nextAiringEpisode when currently_airing but AniList has no entry for this MAL id', () => {
        const entry = selectAnimeEntry(
            { node: baseNode({ id: 99, status: 'currently_airing' }), list_status: baseListStatus() },
            NO_AIRING,
        );

        expect(entry.nextAiringEpisode).toBeUndefined();
    });

    it('omits nextAiringEpisode when status is not currently_airing even if the lookup has an entry', () => {
        const entry = selectAnimeEntry(
            { node: baseNode({ id: 42, status: 'finished_airing' }), list_status: baseListStatus() },
            { 42: { airingAt: 1784124000, episode: 11 } },
        );

        expect(entry.nextAiringEpisode).toBeUndefined();
    });

    it('maps nsfw black to isAdult true and white/gray/undefined to false', () => {
        expect(selectAnimeEntry({ node: baseNode({ nsfw: 'white' }), list_status: baseListStatus() }, NO_AIRING).isAdult).toBe(false);
        expect(selectAnimeEntry({ node: baseNode({ nsfw: 'gray' }), list_status: baseListStatus() }, NO_AIRING).isAdult).toBe(false);
        expect(selectAnimeEntry({ node: baseNode({ nsfw: 'black' }), list_status: baseListStatus() }, NO_AIRING).isAdult).toBe(true);
        expect(selectAnimeEntry({ node: baseNode({ nsfw: undefined }), list_status: baseListStatus() }, NO_AIRING).isAdult).toBe(false);
    });

    it('parses end_date variants into PartialDate', () => {
        expect(
            selectAnimeEntry({ node: baseNode({ end_date: '2025-12-19' }), list_status: baseListStatus() }, NO_AIRING).endDate,
        ).toEqual({
            year: 2025,
            month: 12,
            day: 19,
        });
        expect(
            selectAnimeEntry({ node: baseNode({ end_date: '2025-12' }), list_status: baseListStatus() }, NO_AIRING).endDate,
        ).toEqual({
            year: 2025,
            month: 12,
            day: undefined,
        });
        expect(selectAnimeEntry({ node: baseNode({ end_date: '2025' }), list_status: baseListStatus() }, NO_AIRING).endDate).toEqual({
            year: 2025,
            month: undefined,
            day: undefined,
        });
        expect(
            selectAnimeEntry({ node: baseNode({ end_date: undefined }), list_status: baseListStatus() }, NO_AIRING).endDate,
        ).toEqual({});
    });

    it('maps start_season to season enum', () => {
        expect(
            selectAnimeEntry({ node: baseNode({ start_season: { year: 2025, season: 'fall' } }), list_status: baseListStatus() }, NO_AIRING)
                .season,
        ).toBe('FALL');
        expect(
            selectAnimeEntry({ node: baseNode({ start_season: undefined }), list_status: baseListStatus() }, NO_AIRING).season,
        ).toBeUndefined();
    });

    it('maps genres, defaulting to [] when absent', () => {
        expect(
            selectAnimeEntry(
                { node: baseNode({ genres: [{ id: 1, name: 'Action' }, { id: 2, name: 'Adventure' }] }), list_status: baseListStatus() },
                NO_AIRING,
            ).genres,
        ).toEqual(['Action', 'Adventure']);
        expect(selectAnimeEntry({ node: baseNode({ genres: undefined }), list_status: baseListStatus() }, NO_AIRING).genres).toEqual([]);
    });

    it('sets progress from num_episodes_watched, independent of nextAiringEpisode.episode', () => {
        const entry = selectAnimeEntry(
            { node: baseNode({ id: 42, status: 'currently_airing' }), list_status: baseListStatus({ num_episodes_watched: 7 }) },
            { 42: { airingAt: 1784124000, episode: 8 } },
        );

        expect(entry.progress).toBe(7);
        expect(entry.nextAiringEpisode?.episode).toBe(8);
    });
});
