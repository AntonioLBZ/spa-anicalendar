import type { CalendarStats } from '@/lib/airing';

type CalendarToolbarProps = {
    stats: CalendarStats;
    isEditMode: boolean;
    hiddenCount: number;
    onEnter: () => void;
    onSave: () => void;
    onCancel: () => void;
    /** Whether every eligible entry is currently hidden in the edit-mode draft — drives the "hide all"/"show all" toggle label. */
    isAllHidden?: boolean;
    /** Toggles all eligible entries between fully hidden and fully visible in the edit-mode draft. Omit to hide the button. */
    onToggleAll?: () => void;
};

export type { CalendarToolbarProps };
