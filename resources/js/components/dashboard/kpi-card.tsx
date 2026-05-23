import { motion } from 'framer-motion';
import { resolveKpiIcon } from '@/lib/nav-icons';
import { pageItem } from '@/lib/motion';
import { cn } from '@/lib/utils';
import type { DashboardKpi } from '@/types';

type KpiCardProps = {
    kpi: DashboardKpi;
    index?: number;
    className?: string;
};

export function KpiCard({ kpi, index = 0, className }: KpiCardProps) {
    const Icon = resolveKpiIcon(kpi.icon);
    const hasTrend = kpi.trend !== null && kpi.trend !== undefined;

    return (
        <motion.div
            variants={pageItem}
            transition={{ delay: index * 0.05 }}
            className={cn(
                'flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-5 shadow-sm',
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
                <p className="font-mono text-3xl font-bold tracking-tight text-foreground">
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
        </motion.div>
    );
}
