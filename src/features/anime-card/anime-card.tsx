'use client';

import Image from 'next/image';
import Link from 'next/link';

import { CheckMarkIcon, InfoIcon, Pill, ToggleButton } from '@/components';

import './anime-card.css';

import { useAnimeCard } from './use-anime-card';

import type { AnimeCardProps } from './anime-card.types';

const AnimeCard = (props: AnimeCardProps) => {
    const { entry } = props;
    const { state, copy, actions, ids, hoverProps } = useAnimeCard(props);

    return (
        <div className={state.cardClassName} {...hoverProps}>
            <Image className="card__image" src={entry.coverImageUrl} alt={entry.title} fill />
            {state.isNextAiring && <Pill className="card__next-airing">{copy.next}</Pill>}
            <div className="card__overlay">
                {state.hasProgress && (
                    <span className="card__progress" title={copy.progressAria ?? undefined}>
                        {copy.progress}
                    </span>
                )}
                <span className="card__pending">
                    {copy.behind && <span className="card__behind">{copy.behind}</span>}
                    {copy.caughtUp && <span className="card__on-date">{copy.caughtUp}</span>}
                    {copy.airingTime && <span>{copy.airingTime}</span>}
                </span>
                <div className="card__hover-content" id={ids.detailsId}>
                    <div className="card__hover-inner">
                        <span className="card__title label-s" id={ids.titleId}>
                            {entry.title}
                        </span>
                        {copy.countdown && (
                            <span className="card__airing">
                                <span className="card__airing-countdown">{copy.countdown}</span>
                            </span>
                        )}
                        {state.showStatus && (
                            <span
                                className={`card__status label-s card__status--${state.statusVariant}`}
                                role="status"
                            >
                                {copy.status}
                            </span>
                        )}
                    </div>
                </div>
            </div>
            {state.isEditMode ? (
                <>
                    <ToggleButton
                        className="card__hit-area"
                        isSelected={state.isHidden}
                        onChange={actions.onToggleHidden}
                        aria-labelledby={ids.titleId}
                    />
                    <span className={state.selectBadgeClassName} aria-hidden="true">
                        {!state.isHidden && <CheckMarkIcon />}
                    </span>
                </>
            ) : (
                <>
                    <Link
                        className="card__hit-area"
                        href={entry.siteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-labelledby={ids.titleId}
                    />
                    <button
                        type="button"
                        className="card__info-btn"
                        aria-expanded={state.isExpanded}
                        aria-controls={ids.detailsId}
                        aria-label={copy.toggleDetails}
                        onClick={actions.onToggleExpanded}
                    >
                        <InfoIcon />
                    </button>
                </>
            )}
        </div>
    );
};

export { AnimeCard };
