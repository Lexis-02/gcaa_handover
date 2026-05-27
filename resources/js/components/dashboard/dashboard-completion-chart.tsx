import { motion } from 'framer-motion';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { chartColors } from '@/lib/chart-theme';
import { pageItem } from '@/lib/motion';
import { SummaryChartTooltip } from '@/components/summary/summary-chart-tooltip';

type DashboardCompletionChartProps = {
    completionRate: number;
    totalPcs: number;
    complete: number;
    inPipeline: number;
};

export function DashboardCompletionChart({
    completionRate,
    totalPcs,
    complete,
    inPipeline,
}: DashboardCompletionChartProps) {
    const isEmpty = totalPcs === 0;
    const clampedRate = Math.min(100, Math.max(0, completionRate));

    const chartData = isEmpty
        ? []
        : [
              {
                  name: 'Complete',
                  value: complete,
                  fill: chartColors.success,
              },
              {
                  name: 'In pipeline',
                  value: inPipeline,
                  fill: chartColors.muted,
              },
          ];

    return (
        <motion.section
            variants={pageItem}
            className="flex h-full flex-col rounded-2xl border border-border/60 bg-card shadow-sm"
        >
            <div className="border-b border-border/60 px-5 py-4">
                <h3 className="text-base font-semibold tracking-tight">
                    Completion overview
                </h3>
                <p className="mt-0.5 text-sm text-muted-foreground">
                    Finished vs still in progress
                </p>
            </div>

            <div className="relative flex flex-1 flex-col items-center justify-center px-4 py-6">
                {isEmpty ? (
                    <div className="flex h-52 items-center justify-center text-sm text-muted-foreground">
                        No data yet
                    </div>
                ) : (
                    <>
                        <div className="h-52 min-h-52 w-full min-w-0">
                            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={58}
                                        outerRadius={82}
                                        paddingAngle={complete > 0 && inPipeline > 0 ? 2 : 0}
                                        stroke={chartColors.card}
                                        strokeWidth={2}
                                        animationDuration={700}
                                        animationEasing="ease-out"
                                    >
                                        {chartData.map((entry) => (
                                            <Cell
                                                key={entry.name}
                                                fill={entry.fill}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        content={<SummaryChartTooltip />}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <motion.p
                                    className="font-mono text-3xl font-bold leading-none text-foreground"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    {clampedRate}%
                                </motion.p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    complete
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <ul className="space-y-2 border-t border-border/60 px-5 py-4">
                {isEmpty ? (
                    <li className="text-sm text-muted-foreground">
                        Register PCs to see completion breakdown.
                    </li>
                ) : (
                    <>
                        <li className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2">
                                <span
                                    className="size-2.5 rounded-full"
                                    style={{
                                        backgroundColor: chartColors.success,
                                    }}
                                />
                                Complete
                            </span>
                            <span className="font-mono font-semibold">
                                {complete}
                            </span>
                        </li>
                        <li className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2">
                                <span
                                    className="size-2.5 rounded-full"
                                    style={{
                                        backgroundColor: chartColors.muted,
                                    }}
                                />
                                In pipeline
                            </span>
                            <span className="font-mono font-semibold">
                                {inPipeline}
                            </span>
                        </li>
                        <li className="flex items-center justify-between border-t border-border/40 pt-2 text-sm text-muted-foreground">
                            <span>Total tracked</span>
                            <span className="font-mono font-medium text-foreground">
                                {totalPcs}
                            </span>
                        </li>
                    </>
                )}
            </ul>
        </motion.section>
    );
}
