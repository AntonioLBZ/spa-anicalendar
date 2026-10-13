import type { AnimeEntry } from '@/services';

type AiringViewProps = {
    /** Entries to display. */
    entries: AnimeEntry[];
    /** Whether entries are still being fetched; shows a placeholder schedule instead of the empty state. */
    isLoading?: boolean;
    error: unknown;
    onRetry: () => void;
    /** Entry-visibility storage scope; must be unique per data source. */
    scope: string;
    disclosure?: React.ReactNode;
    /** Empty-state copy override. */
    emptyMessage?: string;
    /** "No upcoming episodes" section label override. */
    noAiringLabel?: string;
    /** @default true */
    showWatchStatus?: boolean;
    /** Shows the "explore current season" link. */
    showCurrentSeasonLink?: boolean;
    /** Shows the "explore next season" link. */
    showNextSeasonLink?: boolean;
    /** Hides the "only this season's premieres" filter checkbox. */
    hideNewSeasonFilter?: boolean;
};

export type { AiringViewProps };
