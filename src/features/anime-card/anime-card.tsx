'use client';

import Image from 'next/image';
import Link from 'next/link';

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

const texts = {
    caughtUp: 'Caught up!',
    behind: 'behind',
    next: 'Next',
};

const AnimeCard = (props: AnimeCardProps) => {
    const { entry, hideStatus = false } = props;
    const { timeFormat } = useSettingsContext();
    const titleId = `anime-title-${entry.id}`;

    const totalEpisodes = entry.episodes;
    // TODO mover estos textos tambien y revisar el arbol de accesibiliad
    const progressText = totalEpisodes ? `Ep ${entry.progress}/${totalEpisodes}` : `Ep ${entry.progress}/?`;
    const progressAriaText = `Episode ${entry.progress} of ${totalEpisodes ?? 'unkown'}`;

    const nextEp = entry.nextAiringEpisode;
    const pendingCount = nextEp ? nextEp.episode - entry.progress - 1 : -1;

    const statusVariant = STATUS_VARIANT_MAP[entry.status] ?? 'upcoming';

    return (
        <Link
            className="card body-m"
            href={entry.siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-labelledby={titleId}
        >
            <Image className="card__image" src={entry.coverImageUrl} alt={entry.title} fill />
            {entry.isNextAiring && <Pill className="card__next-airing">{texts.next}</Pill>}
            <div className="card__overlay">
                <span className="card__progress" title={progressAriaText}>
                    {progressText}
                </span>
                <span className="card__pending">
                    {pendingCount > 0 && (
                        <span className="card__behind">
                            {pendingCount} {texts.behind}
                        </span>
                    )}
                    {nextEp && <span>{getLocalAiringTime(nextEp.airingAt, timeFormat)}</span>}
                </span>
                {pendingCount === 0 && <span className="card__on-date">{texts.caughtUp}</span>}
                <div className="card__hover-content">
                    <div className="card__hover-inner">
                        <span className="card__title label-m" id={titleId}>
                            {entry.title}
                        </span>
                        {nextEp && (
                            <span className="card__airing">
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
