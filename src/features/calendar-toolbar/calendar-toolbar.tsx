'use client';

import { useTranslations } from 'next-intl';

import { Link } from '@/components';
import { Link as NavLink } from '@/lib/i18n/navigation';

import './calendar-toolbar.css';

import { useCalendarToolbar } from './use-calendar-toolbar';

import type { CalendarToolbarProps } from './calendar-toolbar.types';

const CalendarToolbar = (props: CalendarToolbarProps) => {
    const { showExploreLinks } = props;
    const { state, copy } = useCalendarToolbar(props);
    const t = useTranslations('calendarToolbar');

    return (
        <div className="calendar-toolbar">
            <div className="calendar-toolbar__row">
                <div className="calendar-toolbar__stats body-m">
                    {copy.pendingStat && <span className="calendar-toolbar__stat">{copy.pendingStat}</span>}
                    {copy.nextEpisodeStat && <span className="calendar-toolbar__stat">{copy.nextEpisodeStat}</span>}
                </div>
                {showExploreLinks && (
                    <div className="calendar-toolbar__explore-links">
                        <Link as={NavLink} variant="secondary" size="s" href="/airing">
                            {t('exploreSeason')}
                        </Link>
                        <Link as={NavLink} variant="secondary" size="s" href="/airing/next-season">
                            {t('exploreNextSeason')}
                        </Link>
                    </div>
                )}
            </div>
            <p className="calendar-toolbar__hint body-s">
                {copy.hint} {state.isEditMode && <span className="calendar-toolbar__count">{copy.hiddenCount}</span>}
            </p>
        </div>
    );
};

export { CalendarToolbar };
