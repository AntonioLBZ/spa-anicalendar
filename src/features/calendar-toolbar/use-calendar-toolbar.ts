import { useTranslations } from 'next-intl';

import { useUserContext } from '@/contexts/user-context';
import { formatCountdown, getTimeUntilAiring } from '@/lib/airing';
import { richBold } from '@/lib/i18n/rich-text';

import type { CalendarToolbarProps } from './calendar-toolbar.types';

const formatPendingDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours === 0) return `${remainingMinutes}m`;
    if (remainingMinutes === 0) return `${hours}h`;
    return `${hours}h ${remainingMinutes}m`;
};

const useCalendarToolbar = (props: CalendarToolbarProps) => {
    const { stats, isEditMode, hiddenCount, onEnter, onSave, onCancel, isAllHidden = false, onToggleAll } = props;
    const t = useTranslations('calendarToolbar');
    const tCard = useTranslations('animeCard');
    const { user } = useUserContext();

    const hasUser = !!user;
    const countdown = stats.nextAiringAt !== null ? getTimeUntilAiring(stats.nextAiringAt) : null;

    let pendingStatText: React.ReactNode = null;
    if (hasUser) {
        pendingStatText =
            stats.pendingMinutes > 0
                ? t.rich('pendingEpisodesWithTime', {
                      count: stats.pendingEpisodes,
                      time: formatPendingDuration(stats.pendingMinutes),
                      ...richBold,
                  })
                : t.rich('pendingEpisodes', { count: stats.pendingEpisodes, ...richBold });
    }

    const nextEpisodeStatText = countdown
        ? t.rich('nextEpisodeIn', { time: formatCountdown(tCard, countdown), ...richBold })
        : null;
    const hintText = hasUser ? t('editHint') : t('editSeasonalHint');
    const toggleAllText = isAllHidden ? t('showAll') : t('hideAll');

    return {
        state: {
            hasUser,
            isEditMode,
            isAllHidden,
        },
        copy: {
            pendingStat: pendingStatText,
            nextEpisodeStat: nextEpisodeStatText,
            hiddenCount: t('hiddenCount', { count: hiddenCount }),
            hint: hintText,
            cancel: t('cancel'),
            save: t('save'),
            edit: t('edit'),
            toggleAll: toggleAllText,
        },
        actions: {
            onEnter,
            onSave,
            onCancel,
            onToggleAll,
        },
    };
};

export { useCalendarToolbar };
