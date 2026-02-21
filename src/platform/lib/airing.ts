/**
 * Returns the day of the week (0 = Monday, 6 = Sunday) for a Unix timestamp.
 * Uses Monday-first ordering for calendar display.
 */
const getAiringDay = (airingAt: number): number => {
    const jsDay = new Date(airingAt * 1000).getDay();
    return jsDay === 0 ? 6 : jsDay - 1;
};

/**
 * Returns a formatted local time string for a Unix timestamp.
 * Example: "15:30" or "3:30 PM" depending on locale.
 */
const getLocalAiringTime = (airingAt: number): string => {
    return new Date(airingAt * 1000).toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
    });
};

/**
 * Returns a human-readable countdown string.
 * Examples: "2d 5h", "5h 30m", "30m"
 */
const getTimeUntilAiring = (airingAt: number): string => {
    const now = Math.floor(Date.now() / 1000);
    const diff = airingAt - now;

    if (diff <= 0) return 'Aired';

    const days = Math.floor(diff / 86400);
    const hours = Math.floor((diff % 86400) / 3600);
    const minutes = Math.floor((diff % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
};

/**
 * Returns the day name for display in the calendar header.
 * dayIndex: 0 = Monday, 6 = Sunday
 */
const getDayName = (dayIndex: number): string => {
    const days = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
    ];
    return days[dayIndex];
};

/**
 * Returns today's day index (0 = Monday, 6 = Sunday).
 */
const getTodayIndex = (): number => {
    const jsDay = new Date().getDay();
    return jsDay === 0 ? 6 : jsDay - 1;
};

export {
    getAiringDay,
    getLocalAiringTime,
    getTimeUntilAiring,
    getDayName,
    getTodayIndex,
};
