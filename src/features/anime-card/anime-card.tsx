'use client';

import { AnimeCard as Card } from '@/components';
import { useSettingsContext } from '@/contexts/settings-context';
import { getLocalAiringTime, getTimeUntilAiring } from '@/lib/airing';

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
    const { timeFormat } = useSettingsContext();
    const titleId = `anime-title-${entry.id}`;
    const progressId = `anime-progress-${entry.id}`;

    const totalEpisodes = entry.episodes;
    const progressText = totalEpisodes ? `Ep ${entry.progress}/${totalEpisodes}` : `Ep ${entry.progress}/?`;

    const nextEp = entry.nextAiringEpisode;
    const pendingCount = nextEp ? nextEp.episode - entry.progress - 1 : 0;

    return (
        <Card.Root href={entry.siteUrl} target="_blank" rel="noopener noreferrer" aria-labelledby={titleId}>
            <Card.Cover>
                <Card.Image src={entry.coverImageUrl} alt={entry.title} />
            </Card.Cover>
            <Card.Info>
                <Card.Title id={titleId}>{entry.title}</Card.Title>
                <Card.Progress
                    id={progressId}
                    aria-label={`Episode ${entry.progress} of ${totalEpisodes ?? 'unknown'}`}
                >
                    {progressText}
                </Card.Progress>
                {pendingCount > 0 && <Card.Pending>{pendingCount} behind</Card.Pending>}
                {nextEp && (
                    <Card.Airing>
                        <span className="anime-card__airing-time">
                            {getLocalAiringTime(nextEp.airingAt, timeFormat)}
                        </span>
                        <span className="anime-card__airing-countdown">{getTimeUntilAiring(nextEp.airingAt)}</span>
                    </Card.Airing>
                )}
                <Card.Status variant={STATUS_VARIANT_MAP[entry.status] ?? 'upcoming'}>
                    {entry.status.replace(/_/g, ' ')}
                </Card.Status>
            </Card.Info>
        </Card.Root>
    );
};

export { AnimeCard };
