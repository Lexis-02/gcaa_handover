import { resolveKpiIcon } from '@/lib/nav-icons';
import { cn } from '@/lib/utils';
import type { DashboardKpi } from '@/types';

type KpiCardProps = {
    kpi: DashboardKpi;
    className?: string;
};

export function KpiCard({ kpi, className }: KpiCardProps) {
    const Icon = resolveKpiIcon(kpi.icon);
    const hasTrend = kpi.trend !== null && kpi.trend !== undefined;

    return (
        <div
            className={cn(
                'dashboard-card flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-5 transition-shadow hover:shadow-md',
                className,
            )}
        >
            <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-muted-foreground">
                    {kpi.label}
                </p>
                <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-4" />
                </span>
            </div>
            <div className="flex items-end justify-between gap-2">
                <p className="text-3xl font-bold tracking-tight text-foreground">
                    {kpi.value.toLocaleString()}
                    {kpi.trend_suffix && (
                        <span className="text-lg font-semibold text-muted-foreground">
                            {kpi.trend_suffix}
                        </span>
                    )}
                </p>
                {hasTrend && (
                    <span
                        className={cn(
                            'rounded-full px-2 py-0.5 text-xs font-semibold',
                            (kpi.trend ?? 0) >= 0
                                ? 'bg-success/15 text-success'
                                : 'bg-destructive/15 text-destructive',
                        )}
                    >
                        {(kpi.trend ?? 0) >= 0 ? '+' : ''}
                        {kpi.trend}
                        {kpi.trend_suffix ? '' : '%'}
                    </span>
                )}
            </div>
        </div>
    );
}
