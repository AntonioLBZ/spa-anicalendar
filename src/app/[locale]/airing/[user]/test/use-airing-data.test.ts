import { describe, expect, it } from 'vitest';

import { getCurrentSeason } from '@/lib/airing';

import { buildRequestedStatuses, filterAiringEntries } from '../use-airing-data.filters';

import type { AnimeEntry, MediaFormat } from '@/services/models';

describe('useAiringData exported functions', () => {
    const { season: currentSeason, seasonYear: currentSeasonYear } = getCurrentSeason();
    const otherSeasonYear = currentSeasonYear - 5;

    const createEntry = (overrides: Partial<AnimeEntry> = {}): AnimeEntry => ({
        id: 1,
        mediaId: 1,
        title: 'Test Anime',
        coverImageUrl: '',
        status: 'RELEASING',
        siteUrl: 'https://example.com',
        endDate: {},
        isAdult: false,
        genres: [],
        ...overrides,
    });

    describe('buildRequestedStatuses', () => {
        it('returns WATCHING when watching is true and planning is false', () => {
            const result = buildRequestedStatuses({ watching: true, planning: false });
            expect(result).toEqual(['WATCHING']);
        });

        it('returns PLANNING when planning is true and watching is false', () => {
            const result = buildRequestedStatuses({ watching: false, planning: true });
            expect(result).toEqual(['PLANNING']);
        });

        it('returns both when both watching and planning are true', () => {
            const result = buildRequestedStatuses({ watching: true, planning: true });
            expect(result).toContain('WATCHING');
            expect(result).toContain('PLANNING');
            expect(result).toHaveLength(2);
        });

        it('falls back to WATCHING when neither watching nor planning is selected', () => {
            const result = buildRequestedStatuses({ watching: false, planning: false });
            expect(result).toEqual(['WATCHING']);
        });
    });

    describe('filterAiringEntries', () => {
        describe('format filtering', () => {
            it('includes all entries when no format filter is active', () => {
                const entries = [
                    createEntry({ listStatus: 'WATCHING', format: 'TV' }),
                    createEntry({ listStatus: 'WATCHING', format: 'MOVIE' }),
                    createEntry({ listStatus: 'WATCHING', format: undefined }),
                ];

                const filtered = filterAiringEntries(entries, { formats: [], onlyNewSeason: false });

                expect(filtered).toHaveLength(3);
            });

            it('includes only matching entries when a format filter is active', () => {
                const entries = [
                    createEntry({ listStatus: 'WATCHING', format: 'TV' }),
                    createEntry({ listStatus: 'WATCHING', format: 'MOVIE' }),
                    createEntry({ listStatus: 'WATCHING', format: 'TV' }),
                    createEntry({ listStatus: 'WATCHING', format: undefined }),
                ];

                const filtered = filterAiringEntries(entries, { formats: ['TV'] as MediaFormat[], onlyNewSeason: false });

                expect(filtered).toHaveLength(2);
                expect(filtered.every((e) => e.format === 'TV')).toBe(true);
            });

            it('excludes entries with undefined format when a filter is active, even watching-sourced ones', () => {
                const entries = [
                    createEntry({ listStatus: 'WATCHING', format: 'TV' }),
                    createEntry({ listStatus: 'WATCHING', format: undefined }),
                    createEntry({ listStatus: 'WATCHING', format: 'MOVIE' }),
                ];

                const filtered = filterAiringEntries(entries, { formats: ['TV', 'MOVIE'] as MediaFormat[], onlyNewSeason: false });

                expect(filtered).toHaveLength(2);
                expect(filtered.every((e) => e.format !== undefined)).toBe(true);
            });
        });

        describe('watching-sourced entries: kept regardless of media status (bug regression coverage)', () => {
            it('keeps a watching-sourced RELEASING entry', () => {
                const entry = createEntry({ listStatus: 'WATCHING', status: 'RELEASING' });
                const filtered = filterAiringEntries([entry], { formats: [], onlyNewSeason: false });
                expect(filtered).toContainEqual(entry);
            });

            it('keeps a watching-sourced FINISHED entry even when it finished long ago (the reported JoJo/Iruma bug)', () => {
                const entry = createEntry({
                    listStatus: 'WATCHING',
                    status: 'FINISHED',
                    endDate: { year: otherSeasonYear, month: 3, day: 20 },
                    season: 'WINTER',
                    seasonYear: otherSeasonYear,
                });
                const filtered = filterAiringEntries([entry], { formats: [], onlyNewSeason: false });
                expect(filtered).toContainEqual(entry);
            });

            it('keeps a watching-sourced HIATUS entry', () => {
                const entry = createEntry({ listStatus: 'WATCHING', status: 'HIATUS' });
                const filtered = filterAiringEntries([entry], { formats: [], onlyNewSeason: false });
                expect(filtered).toContainEqual(entry);
            });

            it('keeps a watching-sourced CANCELLED entry', () => {
                const entry = createEntry({ listStatus: 'WATCHING', status: 'CANCELLED' });
                const filtered = filterAiringEntries([entry], { formats: [], onlyNewSeason: false });
                expect(filtered).toContainEqual(entry);
            });

            it('keeps a watching-sourced NOT_YET_RELEASED entry regardless of season', () => {
                const entry = createEntry({ listStatus: 'WATCHING', status: 'NOT_YET_RELEASED', season: 'WINTER', seasonYear: otherSeasonYear });
                const filtered = filterAiringEntries([entry], { formats: [], onlyNewSeason: false });
                expect(filtered).toContainEqual(entry);
            });
        });

        describe('planning-sourced entries: only shown when there is something to display', () => {
            it('keeps a planning-sourced RELEASING entry', () => {
                const entry = createEntry({ listStatus: 'PLANNING', status: 'RELEASING' });
                const filtered = filterAiringEntries([entry], { formats: [], onlyNewSeason: false });
                expect(filtered).toContainEqual(entry);
            });

            it('keeps a planning-sourced FINISHED entry that finished in the current season', () => {
                const entry = createEntry({
                    listStatus: 'PLANNING',
                    status: 'FINISHED',
                    endDate: { year: currentSeasonYear, month: 6, day: 10 },
                });
                const filtered = filterAiringEntries([entry], { formats: [], onlyNewSeason: false });
                expect(filtered).toContainEqual(entry);
            });

            it('excludes a planning-sourced FINISHED entry that finished long ago', () => {
                const entry = createEntry({
                    listStatus: 'PLANNING',
                    status: 'FINISHED',
                    endDate: { year: otherSeasonYear, month: 3, day: 20 },
                    season: 'WINTER',
                    seasonYear: otherSeasonYear,
                });
                const filtered = filterAiringEntries([entry], { formats: [], onlyNewSeason: false });
                expect(filtered).not.toContainEqual(entry);
            });

            it('keeps a planning-sourced NOT_YET_RELEASED entry that premieres this season', () => {
                const entry = createEntry({
                    listStatus: 'PLANNING',
                    status: 'NOT_YET_RELEASED',
                    season: currentSeason,
                    seasonYear: currentSeasonYear,
                });
                const filtered = filterAiringEntries([entry], { formats: [], onlyNewSeason: false });
                expect(filtered).toContainEqual(entry);
            });

            it('excludes a planning-sourced NOT_YET_RELEASED entry premiering in a different season', () => {
                const entry = createEntry({
                    listStatus: 'PLANNING',
                    status: 'NOT_YET_RELEASED',
                    season: 'WINTER',
                    seasonYear: otherSeasonYear,
                });
                const filtered = filterAiringEntries([entry], { formats: [], onlyNewSeason: false });
                expect(filtered).not.toContainEqual(entry);
            });

            it('excludes a planning-sourced NOT_YET_RELEASED entry with no season data at all', () => {
                const entry = createEntry({
                    listStatus: 'PLANNING',
                    status: 'NOT_YET_RELEASED',
                    season: undefined,
                    seasonYear: undefined,
                });
                const filtered = filterAiringEntries([entry], { formats: [], onlyNewSeason: false });
                expect(filtered).not.toContainEqual(entry);
            });

            it('excludes a planning-sourced HIATUS/CANCELLED entry', () => {
                const entries = [
                    createEntry({ listStatus: 'PLANNING', status: 'HIATUS' }),
                    createEntry({ listStatus: 'PLANNING', status: 'CANCELLED' }),
                ];
                const filtered = filterAiringEntries(entries, { formats: [], onlyNewSeason: false });
                expect(filtered).toHaveLength(0);
            });
        });

        describe('onlyNewSeason per-entry rule (applies to RELEASING entries regardless of origin)', () => {
            it('keeps RELEASING entries with undefined season when onlyNewSeason is true', () => {
                const entry = createEntry({ listStatus: 'WATCHING', status: 'RELEASING', season: undefined, seasonYear: undefined });
                const filtered = filterAiringEntries([entry], { formats: [], onlyNewSeason: true });
                expect(filtered).toContainEqual(entry);
            });

            it('keeps a RELEASING entry whose season matches the current season when onlyNewSeason is true', () => {
                const entry = createEntry({ listStatus: 'WATCHING', status: 'RELEASING', season: currentSeason, seasonYear: currentSeasonYear });
                const filtered = filterAiringEntries([entry], { formats: [], onlyNewSeason: true });
                expect(filtered).toContainEqual(entry);
            });

            it('excludes a RELEASING entry whose season does not match the current season when onlyNewSeason is true', () => {
                const entry = createEntry({ listStatus: 'WATCHING', status: 'RELEASING', season: 'WINTER', seasonYear: otherSeasonYear });
                const filtered = filterAiringEntries([entry], { formats: [], onlyNewSeason: true });
                expect(filtered).not.toContainEqual(entry);
            });

            it('includes all RELEASING entries regardless of season when onlyNewSeason is false', () => {
                const entries = [
                    createEntry({ listStatus: 'WATCHING', status: 'RELEASING', season: 'WINTER', seasonYear: otherSeasonYear }),
                    createEntry({ listStatus: 'WATCHING', status: 'RELEASING', season: undefined, seasonYear: undefined }),
                ];
                const filtered = filterAiringEntries(entries, { formats: [], onlyNewSeason: false });
                expect(filtered).toHaveLength(2);
            });
        });
    });
});
