import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    HandoverStageProgress,
    type StageProgress,
} from '@/components/handover-stage-progress';
import { ListRowActions } from '@/components/list-row-actions';
import { SignOffButton } from '@/components/sign-off-button';
import { SmartPagination } from '@/components/smart-pagination';
import { pageEnter } from '@/lib/motion';
import { cn } from '@/lib/utils';

type SignOffAction = {
    stage: number;
    title: string;
    description: string;
    form_ref: string;
};

type QueueRecord = {
    id: number;
    ref_no: string;
    make_model: string;
    serial_number: string;
    assignee: { full_name: string } | null;
    department: { name: string } | null;
    status: string;
    stage_progress: StageProgress;
    can_sign_off: boolean;
    sign_off: SignOffAction | null;
};

type PaginatedRecords = {
    data: QueueRecord[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

export default function HandoverSignOffsIndex({
    records,
    status_labels,
    stage_heading,
}: {
    records: PaginatedRecords;
    status_labels: Record<string, string>;
    stage_heading: string;
}) {
    return (
        <>
            <Head title="Sign-offs" />
            <motion.div
                className="flex flex-1 flex-col gap-4 p-4 md:p-6"
                variants={pageEnter}
                initial="hidden"
                animate="visible"
            >
                <div>
                    <p className="text-sm text-muted-foreground">
                        {stage_heading}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        {records.total}{' '}
                        {records.total === 1 ? 'PC' : 'PCs'} in your queue
                    </p>
                </div>

                <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
                    <div className="custom-scrollbar overflow-x-auto">
                        <table className="w-full border-collapse text-sm">
                            <thead>
                                <tr className="border-b bg-muted/40 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    <th className="px-4 py-3">Ref / PC</th>
                                    <th className="hidden px-4 py-3 md:table-cell">
                                        Department
                                    </th>
                                    <th className="px-4 py-3">Progress</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-4 py-12 text-center text-muted-foreground"
                                        >
                                            No PCs awaiting your sign-off.
                                        </td>
                                    </tr>
                                ) : (
                                    records.data.map((row) => (
                                        <tr
                                            key={row.id}
                                            className="border-b border-border/40 align-middle hover:bg-muted/20"
                                        >
                                            <td className="px-4 py-3">
                                                <p className="font-mono text-xs font-semibold text-primary">
                                                    {row.ref_no}
                                                </p>
                                                <p className="font-medium">
                                                    {row.make_model}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {row.assignee?.full_name ??
                                                        'Unassigned'}
                                                </p>
                                            </td>
                                            <td className="hidden px-4 py-3 md:table-cell">
                                                {row.department?.name ?? '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <HandoverStageProgress
                                                    progress={
                                                        row.stage_progress
                                                    }
                                                    compact
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={cn(
                                                        'inline-flex rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium',
                                                    )}
                                                >
                                                    {status_labels[
                                                        row.status
                                                    ] ?? row.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col items-end gap-2">
                                                    {row.can_sign_off &&
                                                        row.sign_off && (
                                                            <SignOffButton
                                                                pcId={row.id}
                                                                signOff={
                                                                    row.sign_off
                                                                }
                                                                size="sm"
                                                            />
                                                        )}
                                                    <ListRowActions
                                                        viewHref={`/pc-register/${row.id}`}
                                                        showEdit={false}
                                                        showDelete={false}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <SmartPagination
                    meta={records}
                    path="/handover-sign-offs"
                />
            </motion.div>
        </>
    );
}

HandoverSignOffsIndex.layout = {
    title: 'Sign-offs',
};
