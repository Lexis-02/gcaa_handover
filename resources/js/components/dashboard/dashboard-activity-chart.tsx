import { motion } from 'framer-motion';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import {
    barCursorFill,
    chartAxisTick,
    chartColors,
    chartGridStroke,
} from '@/lib/chart-theme';
import { pageItem } from '@/lib/motion';
import { SummaryChartTooltip } from '@/components/summary/summary-chart-tooltip';
import type { WeeklyActivityPoint } from '@/types';

type DashboardActivityChartProps = {
    data: WeeklyActivityPoint[];
};

export function DashboardActivityChart({ data }: DashboardActivityChartProps) {
    const peak = Math.max(...data.map((d) => d.count), 1);
    const weekTotal = data.reduce((sum, d) => sum + d.count, 0);

    return (
        <motion.section
            variants={pageItem}
            className="rounded-2xl border border-border/60 bg-card shadow-sm"
        >
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/50 px-6 py-5 md:px-8">
                <div>
                    <h3 className="text-lg font-semibold tracking-tight text-foreground">
                        Handover activity
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Sign-off actions in the selected date range
                    </p>
                </div>
                <div className="text-right">
                    <p className="font-mono text-xl font-bold text-foreground">
                        {weekTotal}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        actions this week
                    </p>
                </div>
            </div>

            <motion.div
                className="h-56 min-h-56 w-full min-w-0 px-2 pt-2 pb-4 md:px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.4 }}
            >
                {weekTotal === 0 ? (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                        No sign-off activity in this period.
                    </div>
                ) : (
                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                        minWidth={0}
                    >
                        <AreaChart
                            data={data}
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
                                domain={[0, Math.max(peak, 2)]}
                                tick={chartAxisTick}
                                tickLine={false}
                                axisLine={false}
                                width={28}
                            />
                            <Tooltip
                                cursor={{
                                    stroke: chartColors.primary,
                                    strokeWidth: 1,
                                }}
                                content={
                                    <SummaryChartTooltip labelKey="label" />
                                }
                            />
                            <Area
                                type="monotone"
                                dataKey="count"
                                stroke={chartColors.primary}
                                strokeWidth={2}
                                fill={barCursorFill}
                                animationDuration={700}
                                animationEasing="ease-out"
                                dot={{
                                    r: 3,
                                    fill: chartColors.card,
                                    stroke: chartColors.primary,
                                    strokeWidth: 2,
                                }}
                                activeDot={{
                                    r: 5,
                                    fill: chartColors.primary,
                                }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </motion.div>
        </motion.section>
    );
}
