import { format, subDays } from 'date-fns';

export function formatShortDate(date: Date): string {
    return format(date, 'MMM d, yyyy');
}

export function last30DaysLabel(): string {
    const end = new Date();
    const start = subDays(end, 30);

    return `${format(start, 'MMM d')} – ${format(end, 'MMM d, yyyy')}`;
}
