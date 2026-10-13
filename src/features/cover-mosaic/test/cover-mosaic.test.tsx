import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CoverMosaic } from '../cover-mosaic';

import type { AnimeEntry } from '@/services';

const entry = (id: number, overrides: Partial<AnimeEntry> = {}): AnimeEntry => ({
    id,
    mediaId: id,
    title: `Anime ${id}`,
    coverImageUrl: `https://example.com/${id}.jpg`,
    coverColor: '#e4a15d',
    status: 'RELEASING',
    siteUrl: `https://example.com/anime/${id}`,
    endDate: {},
    isAdult: false,
    genres: [],
    ...overrides,
});

const getTiles = (container: HTMLElement) => [...container.querySelectorAll<HTMLElement>('.cover-mosaic__tile')];

describe('CoverMosaic', () => {
    it('fills every tile, repeating a short list, with each cover over its dominant color', () => {
        const { container } = render(<CoverMosaic entries={[entry(1), entry(2)]} />);

        const tiles = getTiles(container);
        expect(tiles).toHaveLength(48);
        expect(tiles[0].style.backgroundColor).toBe('rgb(228, 161, 93)');
        expect(container.querySelector('.cover-mosaic')).toHaveAttribute('aria-hidden', 'true');
    });

    it('always leaves out adult and ecchi covers, whatever the content filter', () => {
        const { container } = render(
            <CoverMosaic entries={[entry(1), entry(2, { isAdult: true }), entry(3, { genres: ['Ecchi'] })]} />
        );

        const sources = getTiles(container).map((tile) => tile.querySelector('img')?.getAttribute('src') ?? '');
        expect(sources.every((src) => src.includes(encodeURIComponent('https://example.com/1.jpg')))).toBe(true);
    });

    it('renders nothing until there are covers', () => {
        const { container } = render(<CoverMosaic entries={[]} />);

        expect(container).toBeEmptyDOMElement();
    });
});
