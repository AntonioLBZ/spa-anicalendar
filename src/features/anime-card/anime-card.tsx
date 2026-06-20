'use client';

import Image from 'next/image';
import Link from 'next/link';

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

const texts = {
    caughtUp: 'Caught up!',
    behind: 'behind',
};

const AnimeCard = (props: AnimeCardProps) => {
    const { entry, hideStatus = false } = props;
    const { timeFormat } = useSettingsContext();
    const titleId = `anime-title-${entry.id}`;

    const totalEpisodes = entry.episodes;
    const progressText = totalEpisodes ? `Ep ${entry.progress}/${totalEpisodes}` : `Ep ${entry.progress}/?`;

    const nextEp = entry.nextAiringEpisode;
    const pendingCount = nextEp ? nextEp.episode - entry.progress - 1 : -1;

    const statusVariant = STATUS_VARIANT_MAP[entry.status] ?? 'upcoming';

    return (
        <Link className="card" href={entry.siteUrl} target="_blank" rel="noopener noreferrer" aria-labelledby={titleId}>
            <Image className="card__image" src={entry.coverImageUrl} alt={entry.title} fill />
            <div className="card__overlay">
                <span className="card__progress body-m">{progressText}</span>
                {pendingCount > 0 && (
                    <span className="card__pending body-m">
                        {pendingCount} {texts.behind}
                    </span>
                )}
                {pendingCount === 0 && <span className="card__on-date body-m">{texts.caughtUp}</span>}
                <div className="card__hover-content">
                    <div className="card__hover-inner">
                        <span className="card__title label-m" id={titleId}>
                            {entry.title}
                        </span>
                        {nextEp && (
                            <span className="card__airing body-m">
                                <span>{getLocalAiringTime(nextEp.airingAt, timeFormat)}</span>
                                <span className="card__airing-countdown">{getTimeUntilAiring(nextEp.airingAt)}</span>
                            </span>
                        )}
                        {!hideStatus && (
                            <span className={`card__status label-s card__status--${statusVariant}`} role="status">
                                {entry.status.replace(/_/g, ' ')}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export { AnimeCard };
