import { WeeklyCalendarRoot } from './weekly-calendar';
import { WeeklyCalendarDay } from './weekly-calendar-day';
import { WeeklyCalendarDayEmpty } from './weekly-calendar-day-empty';
import { WeeklyCalendarDayEntries } from './weekly-calendar-day-entries';
import { WeeklyCalendarDayHeader } from './weekly-calendar-day-header';
import { WeeklyCalendarGrid } from './weekly-calendar-grid';
import { WeeklyCalendarSection } from './weekly-calendar-section';
import { WeeklyCalendarSectionEntries } from './weekly-calendar-section-entries';
import { WeeklyCalendarSectionHeader } from './weekly-calendar-section-header';

const WeeklyCalendar = {
    Root: WeeklyCalendarRoot,
    Grid: WeeklyCalendarGrid,
    Day: WeeklyCalendarDay,
    DayHeader: WeeklyCalendarDayHeader,
    DayEmpty: WeeklyCalendarDayEmpty,
    DayEntries: WeeklyCalendarDayEntries,
    Section: WeeklyCalendarSection,
    SectionHeader: WeeklyCalendarSectionHeader,
    SectionEntries: WeeklyCalendarSectionEntries,
};

export { WeeklyCalendar };
export type {
    WeeklyCalendarDayEmptyProps,
    WeeklyCalendarDayEntriesProps,
    WeeklyCalendarDayHeaderProps,
    WeeklyCalendarDayProps,
    WeeklyCalendarGridProps,
    WeeklyCalendarRootProps,
    WeeklyCalendarSectionEntriesProps,
    WeeklyCalendarSectionHeaderProps,
    WeeklyCalendarSectionProps,
} from './weekly-calendar.types';
