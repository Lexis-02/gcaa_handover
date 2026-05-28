import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { pageEnter } from '@/lib/motion';

type InsightData = {
    heatmap: any[];
    bottlenecks: { user: string; avg_duration: number; tasks_count: number }[];
    topPerformers: { user: string; tasks_count: number }[];
};

export default function InsightsIndex({
    insights,
    scope,
}: {
    insights: InsightData;
    scope: string;
}) {
    return (
        <>
            <Head title={`Insights & Analytics (${scope})`} />
            <motion.div
                className="flex flex-1 flex-col gap-6 p-4 md:p-8"
                variants={pageEnter}
                initial="hidden"
                animate="visible"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                            User Insights
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Advanced performance metrics and bottleneck detection. ({scope} view)
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <a href="/insights/export/pdf" target="_blank">
                                <Download className="size-4 mr-2" />
                                Export PDF
                            </a>
                        </Button>
                        <Button asChild variant="outline">
                            <a href="/insights/export/excel" target="_blank">
                                <Download className="size-4 mr-2" />
                                Export Excel
                            </a>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Top Performers */}
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
                            Top Performers
                        </h2>
                        {insights.topPerformers.length > 0 ? (
                            <ul className="space-y-3">
                                {insights.topPerformers.map((user, idx) => (
                                    <li key={idx} className="flex items-center justify-between">
                                        <span className="font-medium text-slate-700 dark:text-slate-300">
                                            {user.user}
                                        </span>
                                        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                                            {user.tasks_count} tasks
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-slate-500">No data available yet.</p>
                        )}
                    </div>

                    {/* Bottlenecks */}
                    <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-6 shadow-sm dark:border-rose-900/20 dark:bg-slate-950">
                        <h2 className="mb-4 text-lg font-semibold text-rose-900 dark:text-rose-100">
                            Workload Bottlenecks
                        </h2>
                        <p className="mb-4 text-xs text-rose-600 dark:text-rose-400">
                            Users with the highest average time taken to complete tasks.
                        </p>
                        {insights.bottlenecks.length > 0 ? (
                            <ul className="space-y-3">
                                {insights.bottlenecks.map((user, idx) => (
                                    <li key={idx} className="flex items-center justify-between">
                                        <span className="font-medium text-slate-700 dark:text-slate-300">
                                            {user.user}
                                        </span>
                                        <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-800 dark:bg-rose-900/50 dark:text-rose-300">
                                            {user.avg_duration} hrs avg
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-slate-500">No data available yet.</p>
                        )}
                    </div>
                </div>

                {/* Heatmap Placeholder */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                    <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
                        Activity Heatmap
                    </h2>
                    <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50">
                        <p className="text-sm text-slate-500">
                            Heatmap visualization will render here.
                        </p>
                    </div>
                </div>
            </motion.div>
        </>
    );
}
