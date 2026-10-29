export function formatDuration(days: number, locale: string, sessionLabel: string): string {
    if (days === 0) {
        return sessionLabel;
    }

    const [value, unit] =
        days % 365 === 0 ? [days / 365, 'year'] : days % 30 === 0 ? [days / 30, 'month'] : [days, 'day'];

    // Laravel locales use `_` (e.g. `pt_BR`), Intl expects BCP 47 tags.
    return new Intl.NumberFormat(locale.replace('_', '-'), { style: 'unit', unit, unitDisplay: 'long' }).format(value);
}
