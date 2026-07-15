import type { PartialDate } from '@/services/models';

function parseEndDate(endDate: string | null | undefined): PartialDate {
    if (!endDate) {
        return {};
    }

    const [year, month, day] = endDate.split('-').map(Number);

    return {
        year,
        month: month ?? undefined,
        day: day ?? undefined,
    };
}

export { parseEndDate };
