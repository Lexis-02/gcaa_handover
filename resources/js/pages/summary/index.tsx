import { Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Activity, BarChart3 } from 'lucide-react';
import {
    BatchComparisonChart,
    BatchPercentChart,
} from '@/components/summary/batch-comparison-chart';
import { CompletionPieChart } from '@/components/summary/completion-pie-chart';
import {
    DepartmentAssignedChart,
    DepartmentPercentChart,
} from '@/components/summary/department-chart';
import { PipelineBarChart } from '@/components/summary/pipeline-bar-chart';
import { ChartCard } from '@/components/summary/chart-card';
import { SummaryKpiCards } from '@/components/summary/summary-kpi-cards';
import { pageItem, pageStagger } from '@/lib/motion';

type BatchInfo = {
    id: number;
    batch_code: string;
    year: number;
    total_pcs: number;
    registered: number;
};

type Overall = {
    total_in_batch: number;
    registered: number;
    pending: number;
    stage_1: number;
    stage_2: number;
    stage_3: number;
    complete: number;
    faulty_on_arrival: number;
    percent_complete: number;
};

type PipelinePoint = { label: string; count: number; fill: string };
type SplitPoint = { name: string; value: number; fill: string };

type DepartmentRow = {
    id: number;
    name: string;
    code: string;
    short_name: string;
    assigned: number;
    completed: number;
    in_progress: number;
    percent_complete: number;
};

type BatchComparison = {
    id: number;
    label: string;
    batch_code: string;
    total_pcs: number;
    registered: number;
    complete: number;
    percent_complete: number;
};

type BatchOption = {
    id: number;
    batch_code: string;
    year: number;
    label: string;
    total_pcs: number;
};

type PageProps = {
    summary: {
        view_mode: 'all' | 'batch';
        batch: BatchInfo | null;
        overall: Overall;
        pipeline: PipelinePoint[];
        completion_split: SplitPoint[];
        by_department: DepartmentRow[];
        batch_comparison: BatchComparison[];
        scoped_to_department: boolean;
    };
    batches: BatchOption[];
    selected_batch: string;
};

export default function SummaryIndex({
    summary,
    batches,
    selected_batch,
}: PageProps) {
    const {
        view_mode,
        batch,
        overall,
        pipeline,
        completion_split,
        by_department,
        batch_comparison,
        scoped_to_department,
    } = summary;

    const isAllBatches = view_mode === 'all';

    const onBatchChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        router.get(
            '/summary',
            value === 'all' ? { batch: 'all' } : { batch: value },
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <>
            <Head title="Handover summary" />
            <motion.div
                className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-4 md:p-6"
                variants={pageStagger}
                initial="hidden"
                animate="visible"
            >
                <motion.div
                    variants={pageItem}
                    className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
                >
                    <div>
                        <div className="flex items-center gap-2 text-primary">
                            <Activity className="size-5" />
                            <span className="text-xs font-semibold uppercase tracking-widest">
                                Live
                            </span>
                        </div>
                        <h2 className="mt-1 text-xl font-semibold tracking-tight">
                            Handover progress
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {isAllBatches
                                ? 'Overview across all batches'
                                : batch
                                  ? `${batch.batch_code} · ${batch.year}`
                                  : 'Select a batch'}
                            {scoped_to_department && ' · Your department only'}
                        </p>
                    </div>
                    <div className="flex min-w-[14rem] flex-col gap-1">
                        <label
                            htmlFor="batch-select"
                            className="text-xs font-medium text-muted-foreground"
                        >
                            Batch filter
                        </label>
                        <select
                            id="batch-select"
                            value={selected_batch || 'all'}
                            onChange={onBatchChange}
                            className="h-10 rounded-lg border border-border bg-background px-3 text-sm font-medium shadow-sm"
                        >
                            <option value="all">All batches — overview</option>
                            {batches.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.label} ({option.total_pcs} PCs)
                                </option>
                            ))}
                        </select>
                    </div>
                </motion.div>

                <SummaryKpiCards overall={overall} />

                <motion.div
                    variants={pageItem}
                    className="relative overflow-hidden rounded-xl border border-primary/15 bg-gradient-to-r from-primary/10 via-card to-card p-4"
                >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2">
                            <BarChart3 className="size-5 text-primary" />
                            <span className="text-sm font-medium">
                                Overall completion
                            </span>
                        </div>
                        <span className="font-mono text-2xl font-bold text-primary">
                            {overall.percent_complete.toFixed(1)}%
                        </span>
                    </div>
                    <div className="mt-3 h-3 overflow-hidden rounded-full bg-muted">
                        <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-500"
                            initial={{ width: 0 }}
                            animate={{
                                width: `${Math.min(overall.percent_complete, 100)}%`,
                            }}
                            transition={{
                                duration: 0.9,
                                ease: [0.4, 0, 0.2, 1],
                            }}
                        />
                    </div>
                </motion.div>

                {isAllBatches && batch_comparison.length > 0 && (
                    <div className="grid gap-6 lg:grid-cols-2">
                        <ChartCard
                            index={0}
                            title="Batch performance"
                            description="Registered vs complete PCs per batch"
                        >
                            <BatchComparisonChart data={batch_comparison} />
                        </ChartCard>
                        <ChartCard
                            index={1}
                            title="Completion rate by batch"
                            description="% of batch capacity fully handed over"
                        >
                            <BatchPercentChart data={batch_comparison} />
                        </ChartCard>
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-2">
                    <ChartCard
                        index={2}
                        title="Handover pipeline"
                        description="PCs at each stage of the process"
                    >
                        <PipelineBarChart data={pipeline} />
                    </ChartCard>
                    <ChartCard
                        index={3}
                        title="Status breakdown"
                        description="Complete, in pipeline, and unregistered slots"
                    >
                        <CompletionPieChart data={completion_split} />
                    </ChartCard>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <ChartCard
                        index={4}
                        title="By department — workload"
                        description="Completed vs still in progress (assigned PCs only)"
                    >
                        <DepartmentAssignedChart data={by_department} />
                    </ChartCard>
                    <ChartCard
                        index={5}
                        title="By department — % complete"
                        description="Top departments by completion rate"
                    >
                        <DepartmentPercentChart data={by_department} />
                    </ChartCard>
                </div>

                {overall.faulty_on_arrival > 0 && (
                    <p className="text-center text-xs text-muted-foreground">
                        {overall.faulty_on_arrival} PC
                        {overall.faulty_on_arrival === 1 ? '' : 's'} marked
                        faulty on arrival (shown in status breakdown).
                    </p>
                )}
            </motion.div>
        </>
    );
}

SummaryIndex.layout = {
    title: 'Summary',
};
