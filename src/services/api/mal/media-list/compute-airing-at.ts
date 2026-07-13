const JST_OFFSET_MS = 9 * 60 * 60 * 1000;

const DAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

function computeAiringAt(dayOfWeek: string, startTime: string, now: Date): number {
    const targetDay = DAY_NAMES.indexOf(dayOfWeek.toLowerCase());
    const [hours, minutes] = startTime.split(':').map(Number);

    const nowJst = new Date(now.getTime() + JST_OFFSET_MS);

    const candidateJst = new Date(
        Date.UTC(nowJst.getUTCFullYear(), nowJst.getUTCMonth(), nowJst.getUTCDate(), hours, minutes, 0, 0),
    );

    let dayDiff = targetDay - nowJst.getUTCDay();

    if (dayDiff < 0 || (dayDiff === 0 && candidateJst.getTime() <= nowJst.getTime())) {
        dayDiff += 7;
    }

    candidateJst.setUTCDate(candidateJst.getUTCDate() + dayDiff);

    return Math.floor((candidateJst.getTime() - JST_OFFSET_MS) / 1000);
}

export { computeAiringAt };
