import { motion } from 'framer-motion';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import {
    barCursorFill,
    chartAxisTick,
    chartGridStroke,
} from '@/lib/chart-theme';
import { pageItem } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { SummaryChartTooltip } from '@/components/summary/summary-chart-tooltip';
import type { PipelineChartPoint, PipelineSegment } from '@/types';

type DashboardPipelinePanelProps = {
    segments: PipelineSegment[];
    chartData: PipelineChartPoint[];
    completionRate: number;
    totalPcs: number;
};

export function DashboardPipelinePanel({
    segments,
    chartData,
    completionRate,
    totalPcs,
}: DashboardPipelinePanelProps) {
    const total = segments.reduce((sum, s) => sum + s.value, 0);

    return (
        <motion.section
            variants={pageItem}
            className="flex flex-col rounded-2xl border border-border/60 bg-card shadow-sm"
        >
            <div className="border-b border-border/60 px-5 py-4 md:px-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h3 className="text-base font-semibold tracking-tight">
                            Handover pipeline
                        </h3>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                            PCs by stage in your scope
                        </p>
                    </div>
                    <div className="flex gap-6 text-right">
                        <div>
                            <p className="font-mono text-2xl font-bold text-foreground">
                                {totalPcs}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Total PCs
                            </p>
                        </div>
                        <div>
                            <p className="font-mono text-2xl font-bold text-primary">
                                {completionRate}%
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Complete
                            </p>
                        </div>
                    </div>
                </div>

                {total > 0 ? (
                    <div className="mt-4 flex h-2.5 overflow-hidden rounded-full bg-muted">
                        {segments.map((segment, index) => (
                            <motion.div
                                key={segment.label}
                                initial={{ width: 0 }}
                                animate={{
                                    width: `${(segment.value / total) * 100}%`,
                                }}
                                transition={{
                                    delay: 0.15 + index * 0.05,
                                    duration: 0.45,
                                    ease: [0.4, 0, 0.2, 1],
                                }}
                                className="h-full min-w-[2px]"
                                style={{ backgroundColor: segment.fill }}
                                title={`${segment.label}: ${segment.value}`}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="mt-3 text-sm text-muted-foreground">
                        No PCs in scope yet.
                    </p>
                )}

                <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
                    {segments.map((segment) => (
                        <li
                            key={segment.label}
                            className="rounded-lg border border-border/50 bg-muted/30 px-2.5 py-2"
                        >
                            <div className="flex items-center gap-1.5">
                                <span
                                    className="size-2 shrink-0 rounded-full"
                                    style={{ backgroundColor: segment.fill }}
                                />
                                <span className="truncate text-xs text-muted-foreground">
                                    {segment.label}
                                </span>
                            </div>
                            <p className="mt-1 font-mono text-lg font-bold tabular-nums">
                                {segment.value}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="px-2 pb-4 pt-2 md:px-4">
                <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Stage distribution
                </p>
                {total > 0 ? (
                    <motion.div
                        className="h-56 min-h-56 w-full min-w-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                    >
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <BarChart
                                data={chartData}
                                margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke={chartGridStroke}
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="label"
                                    tick={chartAxisTick}
                                    tickLine={false}
                                    axisLine={{ stroke: chartGridStroke }}
                                />
                                <YAxis
                                    allowDecimals={false}
                                    tick={chartAxisTick}
                                    tickLine={false}
                                    axisLine={false}
                                    width={28}
                                />
                                <Tooltip
                                    cursor={{ fill: barCursorFill }}
                                    content={
                                        <SummaryChartTooltip labelKey="label" />
                                    }
                                />
                                <Bar
                                    dataKey="count"
                                    radius={[6, 6, 0, 0]}
                                    maxBarSize={48}
                                    animationDuration={650}
                                    animationEasing="ease-out"
                                >
                                    {chartData.map((entry) => (
                                        <Cell
                                            key={entry.label}
                                            fill={entry.fill}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>
                ) : (
                    <div
                        className={cn(
                            'flex h-56 items-center justify-center text-sm text-muted-foreground',
                        )}
                    >
                        Chart will appear when PCs are registered.
                    </div>
                )}
            </div>
        </motion.section>
    );
}
