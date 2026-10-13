import { describe, expect, it } from 'vitest';

import { accentFromProfileColor } from '../profile-accent';

describe('accentFromProfileColor', () => {
    it("maps AniList's preset profile colors to their schemes, blue to Sky", () => {
        expect(accentFromProfileColor('blue')).toBe('anilist');
        expect(accentFromProfileColor('purple')).toBe('purple');
        expect(accentFromProfileColor('pink')).toBe('pink');
        expect(accentFromProfileColor('orange')).toBe('orange');
        expect(accentFromProfileColor('red')).toBe('red');
        expect(accentFromProfileColor('green')).toBe('green');
        expect(accentFromProfileColor('gray')).toBe('gray');
    });

    it("snaps a supporter's custom hex color to the scheme with the nearest hue", () => {
        expect(accentFromProfileColor('#ff2020')).toBe('red');
        expect(accentFromProfileColor('#f5c400')).toBe('orange');
        expect(accentFromProfileColor('#2ecc71')).toBe('green');
        expect(accentFromProfileColor('#3db4f2')).toBe('anilist');
        expect(accentFromProfileColor('#8e44ad')).toBe('purple');
        expect(accentFromProfileColor('#ff69b4')).toBe('pink');
    });

    it('treats washed-out custom colors as gray', () => {
        expect(accentFromProfileColor('#5a6270')).toBe('gray');
        expect(accentFromProfileColor('#ffffff')).toBe('gray');
    });

    it('returns undefined when there is no usable color', () => {
        expect(accentFromProfileColor(undefined)).toBeUndefined();
        expect(accentFromProfileColor('')).toBeUndefined();
        expect(accentFromProfileColor('teal')).toBeUndefined();
        expect(accentFromProfileColor('#abc')).toBeUndefined();
    });
});
