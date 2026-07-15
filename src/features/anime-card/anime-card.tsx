'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Pill } from '@/components';
import { useSettingsContext } from '@/contexts/settings-context';
import { getLocalAiringTime, getTimeUntilAiring } from '@/lib/airing';

import './anime-card.css';

import type { AnimeCardProps } from './anime-card.types';

const STATUS_VARIANT_MAP: Record<string, 'releasing' | 'finished' | 'hiatus' | 'cancelled' | 'upcoming'> = {
    RELEASING: 'releasing',
    FINISHED: 'finished',
    HIATUS: 'hiatus',
    CANCELLED: 'cancelled',
    NOT_YET_RELEASED: 'upcoming',
};

const STATUS_KEY_MAP: Record<string, string> = {
    RELEASING: 'releasing',
    FINISHED: 'finished',
    HIATUS: 'hiatus',
    CANCELLED: 'cancelled',
    NOT_YET_RELEASED: 'notYetReleased',
};

const AnimeCard = (props: AnimeCardProps) => {
    const { entry, hideStatus = false } = props;
    const { timeFormat } = useSettingsContext();
    const t = useTranslations('animeCard');
    const titleId = `anime-title-${entry.id}`;

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

    const statusVariant = STATUS_VARIANT_MAP[entry.status] ?? 'upcoming';
    const statusKey = STATUS_KEY_MAP[entry.status] ?? 'notYetReleased';

    const countdown = nextEp ? getTimeUntilAiring(nextEp.airingAt) : null;
    const countdownText =
        countdown &&
        (countdown.unit === 'aired'
            ? t('aired')
            : countdown.unit === 'days'
              ? t('countdownDays', { days: countdown.days, hours: countdown.hours })
              : countdown.unit === 'hours'
                ? t('countdownHours', { hours: countdown.hours, minutes: countdown.minutes })
                : t('countdownMinutes', { minutes: countdown.minutes }));

    return (
        <Link
            className="card body-m"
            href={entry.siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-labelledby={titleId}
        >
            <Image className="card__image" src={entry.coverImageUrl} alt={entry.title} fill />
            {entry.isNextAiring && <Pill className="card__next-airing">{t('next')}</Pill>}
            <div className="card__overlay">
                <span className="card__progress" title={progressAriaText}>
                    {progressText}
                </span>
                <span className="card__pending">
                    {pendingCount > 0 ? (
                        <span className="card__behind">{t('behind', { count: pendingCount })}</span>
                    ) : (
                        <span className="card__on-date">{t('caughtUp')}</span>
                    )}
                    est
                    {nextEp && <span>{getLocalAiringTime(nextEp.airingAt, timeFormat)}</span>}
                </span>
                <div className="card__hover-content">
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
                            <span className={`card__status label-s card__status--${statusVariant}`} role="status">
                                {t(`status.${statusKey}`)}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export { AnimeCard };
