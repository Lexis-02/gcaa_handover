/**
 * Recharts/SVG cannot resolve CSS variables like hsl(var(--chart-1)) — use hex.
 * Keep in sync with resources/css/brand.css semantic chart tokens.
 */
export const chartColors = {
    primary: '#1990cf',
    success: '#10b981',
    warning: '#f97316',
    info: '#14b8a6',
    secondary: '#6b7280',
    muted: '#cbd5e1',
    danger: '#ef4444',
    violet: '#8b5cf6',
    card: '#ffffff',
    foreground: '#051d29',
    mutedForeground: '#6b7280',
    border: '#b8d9eb',
    grid: '#e2e8f0',
    pipeline: {
        Pending: '#f97316',
        'Stage 1': '#1990cf',
        'Stage 2': '#14b8a6',
        'Stage 3': '#8b5cf6',
        Complete: '#10b981',
    },
    status: {
        Complete: '#10b981',
        'In pipeline': '#1990cf',
        'Not registered': '#cbd5e1',
        'Faulty on arrival': '#ef4444',
    },
    batch: {
        size: '#cbd5e1',
        registered: '#33a7df',
        complete: '#10b981',
        percent: '#1990cf',
    },
    department: {
        completed: '#10b981',
        inProgress: '#1990cf',
        percent: '#1473a6',
    },
} as const;

export const chartAxisTick = {
    fontSize: 11,
    fill: chartColors.mutedForeground,
};

export const chartGridStroke = chartColors.grid;

/** Slightly brighter fill for bar hover */
export function barHoverFill(base: string): string {
    return base;
}

export const barCursorFill = 'rgba(25, 144, 207, 0.06)';
