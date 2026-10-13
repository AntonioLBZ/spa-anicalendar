'use client';

import Image from 'next/image';
import { useMemo } from 'react';

import { filterByContent } from '@/features/weekly-calendar';

import './cover-mosaic.css';

import type { CoverMosaicProps } from './cover-mosaic.types';

// Enough tiles to cover a wide screen at the smallest tile size; short lists repeat
const TILE_COUNT = 48;

/** Decorative wall of covers behind a page's hero, faded into the background */
const CoverMosaic = (props: CoverMosaicProps) => {
    const { entries } = props;

    const tiles = useMemo(() => {
        const covers = filterByContent(entries, 'sfw').filter((entry) => entry.coverImageUrl);
        if (covers.length === 0) return [];
        return Array.from({ length: TILE_COUNT }, (_, index) => covers[index % covers.length]);
    }, [entries]);

    if (tiles.length === 0) return null;

    return (
        <div className="cover-mosaic" aria-hidden="true">
            <div className="cover-mosaic__grid">
                {tiles.map((entry, index) => (
                    <span
                        key={index}
                        className="cover-mosaic__tile"
                        style={{ backgroundColor: entry.coverColor }}
                    >
                        <Image className="cover-mosaic__image" src={entry.coverImageUrl} alt="" fill />
                    </span>
                ))}
            </div>
        </div>
    );
};

export { CoverMosaic };
