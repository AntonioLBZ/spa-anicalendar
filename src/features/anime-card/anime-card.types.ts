import type { AnimeEntry } from '@/services';

type AnimeCardProps = {
    /** The anime entry to display on the card. */
    entry: AnimeEntry;
    /** Whether to hide the anime's status (e.g. "Releasing", "Finished") on the card.
     * @default false
     */
    hideStatus?: boolean;
};

export type { AnimeCardProps };
