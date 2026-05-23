import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    HandoverStageProgress,
    type StageProgress,
} from '@/components/handover-stage-progress';
import { ListRowActions } from '@/components/list-row-actions';
import {
    RegisterStatusFilter,
    type StatusFilterValue,
} from '@/components/register-status-filter';
import { SmartPagination } from '@/components/smart-pagination';
import { pageEnter } from '@/lib/motion';
import { cn } from '@/lib/utils';

type RegisterRecord = {
    id: number;
    ref_no: string;
    asset_tag: string | null;
    make_model: string;
    serial_number: string;
    hostname: string | null;
    os: string;
    condition_on_issue: string;
    status: string;
    assignee: { full_name: string } | null;
    department: { name: string } | null;
    building: { name: string } | null;
    stage_progress: StageProgress;
    next_signer: string | null;
    can_edit: boolean;
    can_delete: boolean;
};

type PaginatedRecords = {
    data: RegisterRecord[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

type PageProps = {
    records: PaginatedRecords;
    filters: { q: string; status: StatusFilterValue };
    meta: { can_create: boolean; can_edit: boolean };
    status_labels: Record<string, string>;
};

function statusTone(status: string): string {
    switch (status) {
        case 'complete':
            return 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300';
        case 'faulty_on_arrival':
            return 'bg-destructive/15 text-destructive';
        case 'pending':
            return 'bg-amber-500/15 text-amber-900 dark:text-amber-200';
        default:
            return 'bg-primary/10 text-primary';
    }
}

export default function PcRegisterIndex({
    records,
    filters,
    meta,
    status_labels,
}: PageProps) {
    const hasSearch = filters.q.trim().length > 0;
    const hasStatusFilter = Boolean(filters.status);

    return (
        <>
            <Head title="Handover register" />
            <motion.div
                className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 p-4 md:p-6"
                variants={pageEnter}
                initial="hidden"
                animate="visible"
            >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-muted-foreground">
                        <span>
                            {records.total}{' '}
                            {records.total === 1 ? 'record' : 'records'}
                            {hasSearch && (
                                <>
                                    {' '}
                                    matching &ldquo;
                                    <span className="font-medium text-foreground">
                                        {filters.q}
                                    </span>
                                    &rdquo;
                                </>
                            )}
                        </span>
                        {(hasSearch || hasStatusFilter) && (
                            <>
                                {' · '}
                                <Link
                                    href="/pc-register"
                                    className="text-primary hover:underline"
                                    preserveScroll
                                >
                                    Clear filters
                                </Link>
                            </>
                        )}
                    </div>
                    <RegisterStatusFilter
                        value={filters.status ?? ''}
                        search={filters.q}
                        appearance="plain"
                        className="sm:ml-auto"
                    />
                </div>

                <div className="overflow-hidden rounded-xl bg-card shadow-sm ring-1 ring-border/60">
                    <div className="custom-scrollbar overflow-x-auto">
                        <table className="w-full border-collapse text-sm">
                            <thead>
                                <tr className="border-b bg-muted/40 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    <th className="px-4 py-3">Ref / PC</th>
                                    <th className="hidden px-4 py-3 md:table-cell">
                                        End user
                                    </th>
                                    <th className="hidden px-4 py-3 lg:table-cell">
                                        Location
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
                                            colSpan={6}
                                            className="px-4 py-12 text-center text-muted-foreground"
                                        >
                                            {hasSearch || hasStatusFilter
                                                ? 'No PCs match your filters.'
                                                : 'No PCs in the register yet.'}
                                            {!hasSearch &&
                                                !hasStatusFilter &&
                                                meta.can_create && (
                                                <>
                                                    {' '}
                                                    <Link
                                                        href="/pc-register/create"
                                                        className="font-medium text-primary underline-offset-4 hover:underline"
                                                    >
                                                        Add the first record
                                                    </Link>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ) : (
                                    records.data.map((row) => (
                                        <tr
                                            key={row.id}
                                            className="border-b border-border/40 align-middle hover:bg-muted/20"
                                        >
                                            <td className="px-4 py-3">
                                                <Link
                                                    href={`/pc-register/${row.id}`}
                                                    className="font-mono text-xs font-semibold text-primary hover:underline"
                                                >
                                                    {row.ref_no}
                                                </Link>
                                                <p className="mt-0.5 font-medium">
                                                    {row.make_model}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {row.serial_number}
                                                    {row.asset_tag
                                                        ? ` · ${row.asset_tag}`
                                                        : ''}
                                                </p>
                                                <p className="mt-1 text-xs text-muted-foreground md:hidden">
                                                    {row.assignee?.full_name ??
                                                        'Unassigned'}
                                                </p>
                                            </td>
                                            <td className="hidden px-4 py-3 md:table-cell">
                                                <p className="font-medium">
                                                    {row.assignee?.full_name ??
                                                        '—'}
                                                </p>
                                                {row.next_signer && (
                                                    <p className="mt-1 text-xs text-amber-800 dark:text-amber-300">
                                                        Awaiting:{' '}
                                                        {row.next_signer}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="hidden px-4 py-3 lg:table-cell">
                                                <p>
                                                    {row.department?.name ??
                                                        '—'}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {row.building?.name ??
                                                        '—'}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <HandoverStageProgress
                                                    progress={
                                                        row.stage_progress
                                                    }
                                                    compact
                                                />
                                                {row.next_signer && (
                                                    <p className="mt-1.5 text-xs text-muted-foreground md:hidden">
                                                        Awaiting:{' '}
                                                        {row.next_signer}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={cn(
                                                        'inline-flex max-w-[9rem] rounded-full px-2.5 py-0.5 text-xs font-medium',
                                                        statusTone(row.status),
                                                    )}
                                                >
                                                    {status_labels[
                                                        row.status
                                                    ] ?? row.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <ListRowActions
                                                    viewHref={`/pc-register/${row.id}`}
                                                    editHref={`/pc-register/${row.id}/edit`}
                                                    deleteUrl={`/pc-register/${row.id}`}
                                                    itemLabel={row.ref_no}
                                                    showEdit={
                                                        meta.can_edit &&
                                                        row.can_edit
                                                    }
                                                    showDelete={row.can_delete}
                                                />
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
                    path="/pc-register"
                    query={{
                        q: filters.q || undefined,
                        status: filters.status || undefined,
                    }}
                />
            </motion.div>
        </>
    );
}

PcRegisterIndex.layout = {
    title: 'Register',
};
