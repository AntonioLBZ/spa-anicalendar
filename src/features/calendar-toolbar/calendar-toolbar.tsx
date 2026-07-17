'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/components';
import { formatCountdown, getTimeUntilAiring } from '@/lib/airing';

import './calendar-toolbar.css';

import type { CalendarToolbarProps } from './calendar-toolbar.types';

const formatPendingDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours === 0) return `${remainingMinutes}m`;
    if (remainingMinutes === 0) return `${hours}h`;
    return `${hours}h ${remainingMinutes}m`;
};

const CalendarToolbar = (props: CalendarToolbarProps) => {
    const { stats, isEditMode, hiddenCount, onEnter, onSave, onCancel } = props;
    const t = useTranslations('calendarToolbar');
    const tCard = useTranslations('animeCard');

    const countdown = stats.nextAiringAt !== null ? getTimeUntilAiring(stats.nextAiringAt) : null;
    const richBold = { b: (chunks: React.ReactNode) => <strong>{chunks}</strong> };

    return (
        <div className="calendar-toolbar">
            <div className="calendar-toolbar__row">
                <div className="calendar-toolbar__stats body-m">
                    <span className="calendar-toolbar__stat">
                        {stats.pendingMinutes > 0
                            ? t.rich('pendingEpisodesWithTime', {
                                  count: stats.pendingEpisodes,
                                  time: formatPendingDuration(stats.pendingMinutes),
                                  ...richBold,
                              })
                            : t.rich('pendingEpisodes', { count: stats.pendingEpisodes, ...richBold })}
                    </span>
                    {countdown && (
                        <span className="calendar-toolbar__stat">
                            {t.rich('nextEpisodeIn', { time: formatCountdown(tCard, countdown), ...richBold })}
                        </span>
                    )}
                </div>
                <div className="calendar-toolbar__controls">
                    {isEditMode ? (
                        <>
                            <span className="calendar-toolbar__count body-m">
                                {t('hiddenCount', { count: hiddenCount })}
                            </span>
                            <Button variant="secondary" size="s" onPress={onCancel}>
                                {t('cancel')}
                            </Button>
                            <Button variant="primary" size="s" onPress={onSave}>
                                {t('save')}
                            </Button>
                        </>
                    ) : (
                        <Button variant="secondary" size="s" onPress={onEnter}>
                            {t('edit')}
                        </Button>
                    )}
                </div>
            </div>
            {isEditMode && <p className="calendar-toolbar__hint body-s">{t('editHint')}</p>}
        </div>
    );
};

export { CalendarToolbar };
