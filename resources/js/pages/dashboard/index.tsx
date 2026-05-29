import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { lazy, Suspense } from 'react';
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

const DashboardActivityChart = lazy(() =>
    import('@/components/dashboard/dashboard-activity-chart').then((m) => ({
        default: m.DashboardActivityChart,
    })),
);
const DashboardCompletionChart = lazy(() =>
    import('@/components/dashboard/dashboard-completion-chart').then((m) => ({
        default: m.DashboardCompletionChart,
    })),
);

function ChartFallback() {
    return (
        <div
            className="min-h-[220px] animate-pulse rounded-xl border border-border/60 bg-muted/30"
            aria-hidden
        />
    );
}

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
    const isClerk = role === 'registry_clerk';
    const inPipeline = isClerk ? 0 : Math.max(
        0,
        (stats as any).summary?.total_pcs - (stats as any).summary?.complete,
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

                {isClerk ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                        <KpiCard
                            kpi={{
                                label: 'Total PCs Entered',
                                value: (stats as any).total_entered ?? 0,
                                trend: null,
                                icon: 'database',
                            }}
                        />
                        <KpiCard
                            kpi={{
                                label: 'Handovers Worked On',
                                value: (stats as any).total_handover ?? 0,
                                trend: null,
                                icon: 'rotate-ccw',
                            }}
                        />
                    </div>
                ) : (
                    <>
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {stats.kpis?.map((kpi, index) => (
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
                            <Suspense fallback={<ChartFallback />}>
                                <DashboardCompletionChart
                                    completionRate={stats.summary.completion_rate}
                                    totalPcs={stats.summary.total_pcs}
                                    complete={stats.summary.complete}
                                    inPipeline={inPipeline}
                                />
                            </Suspense>
                        </div>

                        <Suspense fallback={<ChartFallback />}>
                            <DashboardActivityChart data={stats.weekly_activity} />
                        </Suspense>
                    </>
                )}

                <DashboardQuickLinks links={quick_links} />
            </motion.div>
        </>
    );
}

DashboardIndex.layout = {
    title: 'Dashboard',
};
