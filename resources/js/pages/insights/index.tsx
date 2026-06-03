import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Download, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardDateFilter } from '@/components/dashboard/dashboard-date-filter';
import { pageEnter } from '@/lib/motion';
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ZAxis,
} from 'recharts';

type InsightData = {
    heatmap: any[];
    scatterData: { user: string; avg_duration: number; tasks_count: number }[];
    bottlenecks: { user: string; avg_duration: number; tasks_count: number }[];
    topPerformers: { user: string; tasks_count: number }[];
};

export default function InsightsIndex({
    insights,
    scope,
    filters,
}: {
    insights: InsightData;
    scope: string;
    filters: { from: string; to: string };
}) {
    // Custom tooltip for scatter chart
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-800 dark:bg-slate-950">
                    <p className="mb-2 font-semibold text-slate-900 dark:text-slate-100">
                        {data.user}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Avg Duration:{' '}
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                            {data.avg_duration} hrs
                        </span>
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Tasks Completed:{' '}
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                            {data.tasks_count}
                        </span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <>
            <Head title={`Insights & Analytics (${scope})`} />
            <motion.div
                className="flex flex-1 flex-col gap-8 p-4 md:p-8"
                variants={pageEnter}
                initial="hidden"
                animate="visible"
            >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                            User Insights
                        </h1>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Advanced performance metrics and bottleneck
                            detection. ({scope} view)
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <DashboardDateFilter routePath="/insights" />
                        <Button
                            asChild
                            variant="outline"
                            className="border-slate-300 dark:border-slate-700"
                        >
                            <a
                                href={`/insights/export/pdf?from=${filters.from}&to=${filters.to}`}
                                target="_blank"
                            >
                                <Download className="mr-2 size-4" />
                                Export PDF
                            </a>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="border-slate-300 dark:border-slate-700"
                        >
                            <a
                                href={`/insights/export/excel?from=${filters.from}&to=${filters.to}`}
                                target="_blank"
                            >
                                <Download className="mr-2 size-4" />
                                Export Excel
                            </a>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Top Performers Card */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/50">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                                <TrendingUp className="size-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                    Top Performers
                                </h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Most tasks completed recently.
                                </p>
                            </div>
                        </div>

                        {insights.topPerformers.length > 0 ? (
                            <ul className="space-y-4">
                                {insights.topPerformers.map((user, idx) => (
                                    <li
                                        key={idx}
                                        className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                                                {idx + 1}
                                            </div>
                                            <span className="font-medium text-slate-800 dark:text-slate-200">
                                                {user.user}
                                            </span>
                                        </div>
                                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                                            {user.tasks_count} tasks
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-slate-500">
                                No data available yet.
                            </p>
                        )}
                    </div>

                    {/* Bottlenecks Card */}
                    <div className="rounded-2xl border border-rose-200 bg-rose-50/30 p-6 dark:border-rose-900/20 dark:bg-slate-900/50">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/30">
                                <AlertTriangle className="size-5 text-rose-600 dark:text-rose-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-rose-900 dark:text-rose-100">
                                    Workload Bottlenecks
                                </h2>
                                <p className="text-sm text-rose-600/80 dark:text-rose-400/80">
                                    Users with highest average task duration.
                                </p>
                            </div>
                        </div>

                        {insights.bottlenecks.length > 0 ? (
                            <ul className="space-y-4">
                                {insights.bottlenecks.map((user, idx) => (
                                    <li
                                        key={idx}
                                        className="flex items-center justify-between rounded-lg bg-white p-3 dark:bg-slate-800/50"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-8 items-center justify-center rounded-full bg-rose-100 text-xs font-semibold text-rose-700 dark:bg-rose-900/50 dark:text-rose-300">
                                                {idx + 1}
                                            </div>
                                            <span className="font-medium text-slate-800 dark:text-slate-200">
                                                {user.user}
                                            </span>
                                        </div>
                                        <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
                                            {user.avg_duration} hrs avg
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-slate-500">
                                No data available yet.
                            </p>
                        )}
                    </div>
                </div>

                {/* Scatter Chart */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/50">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                            <Users className="size-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                User Performance Distribution (Scatter Graph)
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Visualizing tasks completed against average
                                duration.
                            </p>
                        </div>
                    </div>

                    <div className="h-[400px] w-full pt-4">
                        {insights.scatterData &&
                        insights.scatterData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart
                                    margin={{
                                        top: 20,
                                        right: 20,
                                        bottom: 20,
                                        left: 20,
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke="#e2e8f0"
                                    />
                                    <XAxis
                                        type="number"
                                        dataKey="tasks_count"
                                        name="Tasks Completed"
                                        tick={{ fill: '#64748b' }}
                                        axisLine={{ stroke: '#cbd5e1' }}
                                    />
                                    <YAxis
                                        type="number"
                                        dataKey="avg_duration"
                                        name="Avg Duration (hrs)"
                                        tick={{ fill: '#64748b' }}
                                        axisLine={{ stroke: '#cbd5e1' }}
                                    />
                                    <ZAxis type="number" range={[100, 300]} />
                                    <Tooltip
                                        content={<CustomTooltip />}
                                        cursor={{ strokeDasharray: '3 3' }}
                                    />
                                    <Scatter
                                        name="Users"
                                        data={insights.scatterData}
                                        fill="#6366f1"
                                        fillOpacity={0.7}
                                    />
                                </ScatterChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
                                <p className="text-sm text-slate-500">
                                    Not enough data to generate scatter graph.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </>
    );
}
