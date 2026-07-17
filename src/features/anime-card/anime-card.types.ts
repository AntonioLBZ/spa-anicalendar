import type { AnimeEntry } from '@/services';

type AnimeCardProps = {
    /** The anime entry to display on the card. */
    entry: AnimeEntry;
    /** Whether to hide the anime's status (e.g. "Releasing", "Finished") on the card.
     * @default false
     */
    hideStatus?: boolean;
    /** Whether the calendar is in edit mode (cards become togglable instead of linking out). */
    isEditMode?: boolean;
    /** Whether this entry is currently marked hidden in the edit-mode draft selection. */
    isHidden?: boolean;
    /** Called when the card is activated while in edit mode. */
    onToggle?: () => void;
    /** Whether this is the single entry with the soonest upcoming airing time, across the visible calendar. */
    isNextAiring?: boolean;
};

export type { AnimeCardProps };
