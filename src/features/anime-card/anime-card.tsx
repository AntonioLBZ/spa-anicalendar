'use client';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useHover } from 'react-aria';

import { Pill, ToggleButton } from '@/components';
import { useSettingsContext } from '@/contexts/settings-context';
import { getLocalAiringTime, getTimeUntilAiring } from '@/lib/airing';

import { CheckIcon } from './check-icon';
import { InfoIcon } from './info-icon';

import './anime-card.css';

import type { AnimeCardProps } from './anime-card.types';
import type { CountdownBreakdown } from '@/lib/airing';

const STATUS_META_MAP: Record<
    string,
    { variant: 'releasing' | 'finished' | 'hiatus' | 'cancelled' | 'upcoming'; key: string }
> = {
    RELEASING: { variant: 'releasing', key: 'releasing' },
    FINISHED: { variant: 'finished', key: 'finished' },
    HIATUS: { variant: 'hiatus', key: 'hiatus' },
    CANCELLED: { variant: 'cancelled', key: 'cancelled' },
    NOT_YET_RELEASED: { variant: 'upcoming', key: 'notYetReleased' },
};
const DEFAULT_STATUS_META = STATUS_META_MAP.NOT_YET_RELEASED;

type CountdownTranslator = (key: string, values?: Record<string, number>) => string;

const formatCountdown = (t: CountdownTranslator, countdown: CountdownBreakdown): string => {
    switch (countdown.unit) {
        case 'aired':
            return t('aired');
        case 'days':
            return t('countdownDays', { days: countdown.days, hours: countdown.hours });
        case 'hours':
            return t('countdownHours', { hours: countdown.hours, minutes: countdown.minutes });
        case 'minutes':
            return t('countdownMinutes', { minutes: countdown.minutes });
    }
};

const AnimeCard = (props: AnimeCardProps) => {
    const { entry, hideStatus = false, isEditMode = false, isHidden = false, onToggle } = props;
    const { timeFormat } = useSettingsContext();
    const t = useTranslations('animeCard');
    const titleId = `anime-title-${entry.id}`;
    const detailsId = `anime-details-${entry.id}`;
    const [isExpanded, setIsExpanded] = useState(false);
    const { hoverProps, isHovered } = useHover({});

    const totalEpisodes = entry.episodes;
    const progressText = totalEpisodes
        ? t('episodeProgress', { progress: entry.progress, total: totalEpisodes })
        : t('episodeProgressUnknown', { progress: entry.progress });
    const progressAriaText = t('episodeProgressAria', {
        progress: entry.progress,
        total: totalEpisodes ?? t('unknown'),
    });

    const nextEp = entry.nextAiringEpisode;
    const pendingCount = nextEp ? nextEp.episode - entry.progress - 1 : -1;

    const statusMeta = STATUS_META_MAP[entry.status] ?? DEFAULT_STATUS_META;

    const countdown = nextEp ? getTimeUntilAiring(nextEp.airingAt) : null;
    const countdownText = countdown && formatCountdown(t, countdown);

    const cardClsx = clsx(
        'card body-m',
        isExpanded && 'card--expanded',
        isHovered && 'card--hovered',
        isEditMode && 'card--edit-mode'
    );

    return (
        <div className={cardClsx} {...hoverProps}>
            <Image className="card__image" src={entry.coverImageUrl} alt={entry.title} fill />
            {entry.isNextAiring && <Pill className="card__next-airing">{t('next')}</Pill>}
            <div className="card__overlay">
                <span className="card__progress" title={progressAriaText}>
                    {progressText}
                </span>
                <span className="card__pending">
                    {pendingCount > 0 && <span className="card__behind">{t('behind', { count: pendingCount })}</span>}
                    {pendingCount === 0 && <span className="card__on-date">{t('caughtUp')}</span>}
                    {nextEp && <span>{getLocalAiringTime(nextEp.airingAt, timeFormat)}</span>}
                </span>
                <div className="card__hover-content" id={detailsId}>
                    <div className="card__hover-inner">
                        <span className="card__title label-m" id={titleId}>
                            {entry.title}
                        </span>
                        {nextEp && (
                            <span className="card__airing">
                                <span className="card__airing-countdown">{countdownText}</span>
                            </span>
                        )}
                        {!hideStatus && (
                            <span className={`card__status label-s card__status--${statusMeta.variant}`} role="status">
                                {t(`status.${statusMeta.key}`)}
                            </span>
                        )}
                    </div>
                </div>
            </div>
            {isEditMode ? (
                <>
                    <ToggleButton
                        className="card__link"
                        isSelected={isHidden}
                        onChange={() => onToggle?.()}
                        aria-labelledby={titleId}
                    />
                    <span className={clsx('card__select-badge', isHidden && 'card__select-badge--checked')} aria-hidden="true">
                        {isHidden && <CheckIcon />}
                    </span>
                </>
            ) : (
                <>
                    <Link
                        className="card__link"
                        href={entry.siteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-labelledby={titleId}
                    />
                    <button
                        type="button"
                        className="card__info-btn"
                        aria-expanded={isExpanded}
                        aria-controls={detailsId}
                        aria-label={t('toggleDetails')}
                        onClick={() => {
                            setIsExpanded((value) => !value);
                        }}
                    >
                        <InfoIcon />
                    </button>
                </>
            )}
        </div>
    );
};

export { AnimeCard };
