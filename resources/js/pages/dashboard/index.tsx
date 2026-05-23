import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { DashboardActivityChart } from '@/components/dashboard/dashboard-activity-chart';
import { DashboardCompletionChart } from '@/components/dashboard/dashboard-completion-chart';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardPipelinePanel } from '@/components/dashboard/dashboard-pipeline-panel';
import { DashboardQuickLinks } from '@/components/dashboard/dashboard-quick-links';
import { KpiCard } from '@/components/dashboard/kpi-card';
import { pageStagger } from '@/lib/motion';
import type {
    DashboardMeta,
    DashboardQuickLink,
    DashboardStats,
} from '@/types';

type DashboardFilters = {
    from: string;
    to: string;
};

type DashboardPageProps = {
    role: string;
    meta: DashboardMeta;
    stats: DashboardStats;
    quick_links: DashboardQuickLink[];
    filters: DashboardFilters;
};

export default function DashboardIndex({
    role,
    meta,
    stats,
    quick_links,
}: DashboardPageProps) {
    const inPipeline = Math.max(
        0,
        stats.summary.total_pcs - stats.summary.complete,
    );

    return (
        <>
            <Head title={meta.title} />
            <motion.div
                className="mx-auto flex w-full max-w-6xl flex-col gap-8 p-4 md:p-6"
                variants={pageStagger}
                initial="hidden"
                animate="visible"
            >
                <DashboardHeader meta={meta} role={role} />

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.kpis.map((kpi, index) => (
                        <KpiCard key={kpi.label} kpi={kpi} index={index} />
                    ))}
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <DashboardPipelinePanel
                            segments={stats.pipeline}
                            chartData={stats.pipeline_chart}
                            completionRate={stats.summary.completion_rate}
                            totalPcs={stats.summary.total_pcs}
                        />
                    </div>
                    <DashboardCompletionChart
                        completionRate={stats.summary.completion_rate}
                        totalPcs={stats.summary.total_pcs}
                        complete={stats.summary.complete}
                        inPipeline={inPipeline}
                    />
                </div>

                <DashboardActivityChart data={stats.weekly_activity} />

                <DashboardQuickLinks links={quick_links} />
            </motion.div>
        </>
    );
}

DashboardIndex.layout = {
    title: 'Dashboard',
};
