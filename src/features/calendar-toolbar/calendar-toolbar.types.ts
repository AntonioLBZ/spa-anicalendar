import type { CalendarStats } from '@/lib/airing';

type CalendarToolbarProps = {
    stats: CalendarStats;
    isEditMode: boolean;
    hiddenCount: number;
    onEnter: () => void;
    onSave: () => void;
    onCancel: () => void;
};

export type { CalendarToolbarProps };
