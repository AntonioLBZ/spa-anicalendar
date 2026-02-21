'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { Link } from 'react-aria-components';

import { getLocalAiringTime, getTimeUntilAiring } from '@/platform/lib/airing';

import type { AnimeCardProps } from './anime-card.types';

import './anime-card.css';

const AnimeCard = (props: AnimeCardProps) => {
    const { entry } = props;
    const { media, progress } = entry;
    const titleId = `anime-title-${entry.id}`;
    const progressId = `anime-progress-${entry.id}`;

    const totalEpisodes = media.episodes;
    const progressText = totalEpisodes ? `Ep ${progress}/${totalEpisodes}` : `Ep ${progress}/?`;

    const nextEp = media.nextAiringEpisode;
    const pendingCount = nextEp ? nextEp.episode - progress - 1 : 0;

    const animeCardClsx = 'anime-card';
    const coverClsx = 'anime-card__cover';
    const imageClsx = 'anime-card__image';
    const infoClsx = 'anime-card__info';
    const titleClsx = 'anime-card__title';
    const progressClsx = 'anime-card__progress';
    const pendingClsx = 'anime-card__pending';
    const airingClsx = 'anime-card__airing';
    const airingTimeClsx = 'anime-card__airing-time';
    const airingCountdownClsx = 'anime-card__airing-countdown';
    const statusClsx = clsx('anime-card__status', {
        'anime-card__status--releasing': media.status === 'RELEASING',
        'anime-card__status--finished': media.status === 'FINISHED',
        'anime-card__status--hiatus': media.status === 'HIATUS',
        'anime-card__status--cancelled': media.status === 'CANCELLED',
        'anime-card__status--upcoming': media.status === 'NOT_YET_RELEASED',
    });

    return (
        <Link
            href={media.siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={animeCardClsx}
            aria-labelledby={titleId}
        >
            <div className={coverClsx}>
                <Image
                    src={media.coverImage.medium}
                    alt={media.title.userPreferred}
                    className={imageClsx}
                    loading="lazy"
                />
            </div>
            <div className={infoClsx}>
                <span id={titleId} className={titleClsx}>
                    {media.title.userPreferred}
                </span>
                <span
                    id={progressId}
                    className={progressClsx}
                    aria-label={`Episode ${progress} of ${totalEpisodes ?? 'unknown'}`}
                >
                    {progressText}
                </span>
                {pendingCount > 0 && <span className={pendingClsx}>{pendingCount} behind</span>}
                {nextEp && (
                    <span className={airingClsx}>
                        <span className={airingTimeClsx}>{getLocalAiringTime(nextEp.airingAt)}</span>
                        <span className={airingCountdownClsx}>{getTimeUntilAiring(nextEp.airingAt)}</span>
                    </span>
                )}
                <span className={statusClsx} role="status">
                    {media.status.replace(/_/g, ' ')}
                </span>
            </div>
        </Link>
    );
};

export { AnimeCard };
