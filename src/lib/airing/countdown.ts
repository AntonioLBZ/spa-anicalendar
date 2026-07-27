import type { TimeFormat } from '@/contexts/settings-context';

/** Formatted local time for a Unix timestamp. */
const getLocalAiringTime = (airingAt: number, timeFormat: TimeFormat = '24h'): string => {
    return new Date(airingAt * 1000).toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: timeFormat === '12h',
    });
};

/** Countdown breakdown; `unit` selects the translation key. */
type CountdownBreakdown =
    | { unit: 'aired' }
    | { unit: 'days'; days: number; hours: number }
    | { unit: 'hours'; hours: number; minutes: number }
    | { unit: 'minutes'; minutes: number };

const getTimeUntilAiring = (airingAt: number): CountdownBreakdown => {
    const now = Math.floor(Date.now() / 1000);
    const diff = airingAt - now;

    if (diff <= 0) return { unit: 'aired' };

    const days = Math.floor(diff / 86400);
    const hours = Math.floor((diff % 86400) / 3600);
    const minutes = Math.floor((diff % 3600) / 60);

    if (days > 0) return { unit: 'days', days, hours };
    if (hours > 0) return { unit: 'hours', hours, minutes };
    return { unit: 'minutes', minutes };
};

/** Formats a countdown breakdown via the caller's translator. */
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

export { getLocalAiringTime, getTimeUntilAiring, formatCountdown };
export type { CountdownBreakdown, CountdownTranslator };
