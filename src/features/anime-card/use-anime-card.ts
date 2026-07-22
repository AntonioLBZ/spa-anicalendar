import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useHover } from 'react-aria';

import { useSettingsContext } from '@/contexts/settings-context';
import { formatCountdown, getLocalAiringTime, getTimeUntilAiring } from '@/lib/airing';

import type { AnimeCardProps } from './anime-card.types';

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

const useAnimeCard = (props: AnimeCardProps) => {
    const {
        entry,
        hideStatus = false,
        isEditMode = false,
        isHidden = false,
        onToggle,
        isNextAiring = false,
        showProgress = true,
        showWatchStatus = true,
    } = props;
    const { timeFormat } = useSettingsContext();
    const t = useTranslations('animeCard');
    const titleId = `anime-title-${entry.id}`;
    const detailsId = `anime-details-${entry.id}`;
    const [isExpanded, setIsExpanded] = useState(false);
    const { hoverProps, isHovered } = useHover({});

    // entry.progress means "user's watch count" for a real per-user list
    const nextEp = entry.nextAiringEpisode;
    const hasProgress = showProgress && entry.progress !== undefined;
    const totalEpisodes = entry.episodes;
    const pendingCount = showWatchStatus && hasProgress && nextEp ? nextEp.episode - entry.progress! - 1 : -1;
    const statusMeta = STATUS_META_MAP[entry.status] ?? DEFAULT_STATUS_META;
    const countdown = nextEp ? getTimeUntilAiring(nextEp.airingAt) : null;

    let progressText: string | null = null;
    if (hasProgress) {
        progressText = totalEpisodes
            ? t('episodeProgress', { progress: entry.progress!, total: totalEpisodes })
            : t('episodeProgressUnknown', { progress: entry.progress! });
    }

    const progressAriaText = hasProgress
        ? t('episodeProgressAria', { progress: entry.progress!, total: totalEpisodes ?? t('unknown') })
        : null;
    const behindText = pendingCount > 0 ? t('behind', { count: pendingCount }) : null;
    const caughtUpText = pendingCount === 0 ? t('caughtUp') : null;
    const airingTimeText = nextEp ? getLocalAiringTime(nextEp.airingAt, timeFormat) : null;
    const countdownText = countdown && formatCountdown(t, countdown);

    return {
        state: {
            isEditMode,
            isHidden,
            isExpanded,
            isNextAiring,
            hasProgress,
            showStatus: !hideStatus,
            statusVariant: statusMeta.variant,
            cardClassName: clsx(
                'card body-s',
                isExpanded && 'card--expanded',
                isHovered && 'card--hovered',
                isEditMode && 'card--edit-mode'
            ),
            selectBadgeClassName: clsx('card__select-badge', !isHidden && 'card__select-badge--checked'),
        },
        copy: {
            progress: progressText,
            progressAria: progressAriaText,
            behind: behindText,
            caughtUp: caughtUpText,
            airingTime: airingTimeText,
            countdown: countdownText,
            status: t(`status.${statusMeta.key}`),
            next: t('next'),
            toggleDetails: t('toggleDetails'),
        },
        actions: {
            onToggleHidden: () => onToggle?.(),
            onToggleExpanded: () => setIsExpanded((value) => !value),
        },
        ids: {
            titleId,
            detailsId,
        },
        hoverProps,
    };
};

export { useAnimeCard };
