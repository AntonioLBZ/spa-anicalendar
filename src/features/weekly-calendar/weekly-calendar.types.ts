import type { CalendarLayout, WeekStartDay } from '@/contexts/settings-context';
import type { EntryVisibilityControlsProps } from '@/features/entry-visibility';
import type { AnimeEntry } from '@/services';

type ResolvedCalendarLayout = Exclude<CalendarLayout, 'auto'>;

type WeeklyCalendarProps = {
    /** Entries to display. */
    entries: AnimeEntry[];
    /** Shows a placeholder schedule instead of the entries/empty state while data is loading. */
    isLoading?: boolean;
    /** Whether edit mode is active. */
    isEditMode?: boolean;
    /** Currently hidden entry ids. */
    hiddenIds?: number[];
    /** Called when an entry's hidden state is toggled. */
    onToggleEntry?: (id: number) => void;
    /** Whether cards show the "Ep X/Y" progress badge.
     * @default true
     */
    showProgress?: boolean;
    /** Whether cards show the "behind"/"caught up" indicator.
     * @default true
     */
    showWatchStatus?: boolean;
    /** Empty-state copy override. */
    emptyMessage?: string;
    /** "No upcoming episodes" section label override. */
    noAiringLabel?: string;
    /** Visibility controls + filters trigger, shown in the header. Omit to hide both. */
    visibility?: EntryVisibilityControlsProps;
    /** Hides the "only this season's premieres" filter checkbox. */
    hideNewSeasonFilter?: boolean;
};

type WeeklyCalendarDayProps = {
    /** Day-of-week index. */
    dayIndex: number;
    /** Entries airing this day. */
    entries: AnimeEntry[];
    /** Whether this day is today. */
    isToday: boolean;
    /** First day of the week. */
    weekStartDay: WeekStartDay;
    /** Grid or list rendering. */
    layout: ResolvedCalendarLayout;
    /** Whether edit mode is active. */
    isEditMode?: boolean;
    /** Currently hidden entry ids. */
    hiddenIds?: number[];
    /** Called when an entry's hidden state is toggled. */
    onToggleEntry?: (id: number) => void;
    /** Id of the soonest-airing entry. */
    nextAiringEntryId?: number | null;
    /** @default true */
    showProgress?: boolean;
    /** @default true */
    showWatchStatus?: boolean;
};

type WeeklyCalendarSkeletonProps = {
    /** Grid or list rendering. */
    layout: ResolvedCalendarLayout;
    /** First day of the week. */
    weekStartDay: WeekStartDay;
    /** Day-of-week index of today. */
    todayIndex: number;
};

export type { WeeklyCalendarProps, WeeklyCalendarDayProps, WeeklyCalendarSkeletonProps, ResolvedCalendarLayout };
