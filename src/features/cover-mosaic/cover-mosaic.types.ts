import type { AnimeEntry } from '@/services';

type CoverMosaicProps = {
    /** Entries whose covers tile the mosaic, in order; adult and ecchi ones are always left out. */
    entries: AnimeEntry[];
};

export type { CoverMosaicProps };
