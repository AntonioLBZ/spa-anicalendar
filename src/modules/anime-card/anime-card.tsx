'use client';

import { AnimeCard as Card } from '@/platform/components';
import { getLocalAiringTime, getTimeUntilAiring } from '@/platform/lib/airing';

import type { AnimeCardProps } from './anime-card.types';

const STATUS_VARIANT_MAP: Record<string, 'releasing' | 'finished' | 'hiatus' | 'cancelled' | 'upcoming'> = {
    RELEASING: 'releasing',
    FINISHED: 'finished',
    HIATUS: 'hiatus',
    CANCELLED: 'cancelled',
    NOT_YET_RELEASED: 'upcoming',
};

const AnimeCard = (props: AnimeCardProps) => {
    const { entry } = props;
    const { media, progress } = entry;
    const titleId = `anime-title-${entry.id}`;
    const progressId = `anime-progress-${entry.id}`;

    const totalEpisodes = media.episodes;
    const progressText = totalEpisodes ? `Ep ${progress}/${totalEpisodes}` : `Ep ${progress}/?`;

    const nextEp = media.nextAiringEpisode;
    const pendingCount = nextEp ? nextEp.episode - progress - 1 : 0;

    return (
        <Card.Root href={media.siteUrl} target="_blank" rel="noopener noreferrer" aria-labelledby={titleId}>
            <Card.Cover>
                <Card.Image src={media.coverImage.medium} alt={media.title.userPreferred} />
            </Card.Cover>
            <Card.Info>
                <Card.Title id={titleId}>{media.title.userPreferred}</Card.Title>
                <Card.Progress id={progressId} aria-label={`Episode ${progress} of ${totalEpisodes ?? 'unknown'}`}>
                    {progressText}
                </Card.Progress>
                {pendingCount > 0 && <Card.Pending>{pendingCount} behind</Card.Pending>}
                {nextEp && (
                    <Card.Airing>
                        <span className="anime-card__airing-time">{getLocalAiringTime(nextEp.airingAt)}</span>
                        <span className="anime-card__airing-countdown">{getTimeUntilAiring(nextEp.airingAt)}</span>
                    </Card.Airing>
                )}
                <Card.Status variant={STATUS_VARIANT_MAP[media.status] ?? 'upcoming'} role="status">
                    {media.status.replace(/_/g, ' ')}
                </Card.Status>
            </Card.Info>
        </Card.Root>
    );
};

export { AnimeCard };
