type WeeklyCalendarRootProps = React.ComponentPropsWithRef<'div'>;

type WeeklyCalendarGridProps = React.ComponentPropsWithRef<'div'>;

type WeeklyCalendarDayProps = React.ComponentPropsWithRef<'div'> & {
    isToday?: boolean;
};

type WeeklyCalendarDayHeaderProps = React.ComponentPropsWithRef<'div'> & {
    isToday?: boolean;
};

type WeeklyCalendarDayEntriesProps = React.ComponentPropsWithRef<'div'>;

type WeeklyCalendarSectionProps = React.ComponentPropsWithRef<'div'>;

type WeeklyCalendarSectionHeaderProps = React.ComponentPropsWithRef<'div'>;

type WeeklyCalendarSectionEntriesProps = React.ComponentPropsWithRef<'div'>;

export type {
    WeeklyCalendarDayEntriesProps,
    WeeklyCalendarDayHeaderProps,
    WeeklyCalendarDayProps,
    WeeklyCalendarGridProps,
    WeeklyCalendarRootProps,
    WeeklyCalendarSectionEntriesProps,
    WeeklyCalendarSectionHeaderProps,
    WeeklyCalendarSectionProps,
};
