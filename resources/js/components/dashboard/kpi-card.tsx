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
                'flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-6 shadow-sm',
                className,
            )}
        >
            <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-muted-foreground">
                    {kpi.label}
                </p>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground ring-1 ring-border/50">
                    <Icon className="size-4.5" />
                </span>
            </div>
            <div className="flex items-end justify-between gap-2 mt-1">
                <p className="font-mono text-4xl font-bold tracking-tight text-foreground">
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
                            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset',
                            (kpi.trend ?? 0) >= 0
                                ? 'bg-success/10 text-success ring-success/20'
                                : 'bg-destructive/10 text-destructive ring-destructive/20',
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
