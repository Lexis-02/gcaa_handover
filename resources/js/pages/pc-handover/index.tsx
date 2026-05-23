import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    HandoverRecordFilter,
    type HandoverFilterValue,
} from '@/components/handover-record-filter';
import { ListRowActions } from '@/components/list-row-actions';
import { SmartPagination } from '@/components/smart-pagination';
import { pageEnter } from '@/lib/motion';
import { cn } from '@/lib/utils';

type HandoverRow = {
    row_number: number;
    id: number;
    old_pc_return_id: number | null;
    ref_no: string;
    new_serial_number: string;
    new_make_model: string;
    end_user_name: string | null;
    department: { name: string } | null;
    old_pc_summary: string | null;
    old_pc_condition: string | null;
    data_wiped: string | null;
    returned_to_stores: string | null;
    has_old_pc_return: boolean;
    can_edit: boolean;
};

type PaginatedRecords = {
    data: HandoverRow[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

type PageProps = {
    records: PaginatedRecords;
    filters: { q: string; status: HandoverFilterValue };
    meta: { can_create: boolean };
};

function compactYesNo(value: string | null): string {
    if (!value) {
        return '—';
    }

    return value === 'Yes' ? '✓' : value === 'No' ? '✗' : 'N/A';
}

export default function PcHandoverIndex({
    records,
    filters,
    meta,
}: PageProps) {
    const hasSearch = filters.q.trim().length > 0;
    const hasStatusFilter = Boolean(filters.status);

    return (
        <>
            <Head title="PC Handover" />
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
                                    href="/pc-handover"
                                    className="text-primary hover:underline"
                                    preserveScroll
                                >
                                    Clear filters
                                </Link>
                            </>
                        )}
                    </div>
                    <HandoverRecordFilter
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
                                    <th className="px-4 py-3">#</th>
                                    <th className="px-4 py-3">Ref / PC</th>
                                    <th className="px-4 py-3">End user</th>
                                    <th className="px-4 py-3">Department</th>
                                    <th className="px-4 py-3">Old PC</th>
                                    <th className="px-4 py-3">Return status</th>
                                    <th className="px-4 py-3 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-4 py-12 text-center text-muted-foreground"
                                        >
                                            {hasSearch || hasStatusFilter
                                                ? 'No handover records match your filters.'
                                                : 'No PCs in the handover register yet.'}
                                            {!hasSearch &&
                                                !hasStatusFilter &&
                                                meta.can_create && (
                                                <>
                                                    {' '}
                                                    <Link
                                                        href="/pc-handover/create"
                                                        className="font-medium text-primary underline-offset-4 hover:underline"
                                                    >
                                                        Add old PC details
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
                                            <td className="px-4 py-3 text-xs text-muted-foreground">
                                                {row.row_number}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Link
                                                    href={`/pc-register/${row.id}`}
                                                    className="font-mono text-xs font-semibold text-primary hover:underline"
                                                >
                                                    {row.ref_no}
                                                </Link>
                                                <p className="mt-0.5 font-medium">
                                                    {row.new_make_model}
                                                </p>
                                                <p className="text-xs text-muted-foreground md:hidden">
                                                    {row.end_user_name ?? '—'}
                                                </p>
                                            </td>
                                            <td className="hidden px-4 py-3 md:table-cell">
                                                <p className="font-medium">
                                                    {row.end_user_name ?? '—'}
                                                </p>
                                            </td>
                                            <td className="hidden px-4 py-3 md:table-cell">
                                                {row.department?.name ?? '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                {row.has_old_pc_return ? (
                                                    <>
                                                        <p className="font-medium">
                                                            {row.old_pc_summary}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {row.old_pc_condition}
                                                        </p>
                                                    </>
                                                ) : (
                                                    <span className="inline-flex rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-medium text-amber-900 dark:text-amber-200">
                                                        Pending details
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                {row.has_old_pc_return ? (
                                                    <div className="flex flex-wrap gap-1.5 text-xs">
                                                        <span
                                                            className={cn(
                                                                'rounded-full px-2 py-0.5 font-medium',
                                                                row.data_wiped ===
                                                                    'Yes'
                                                                    ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300'
                                                                    : 'bg-muted text-muted-foreground',
                                                            )}
                                                            title="Data wiped"
                                                        >
                                                            Wipe{' '}
                                                            {compactYesNo(
                                                                row.data_wiped,
                                                            )}
                                                        </span>
                                                        <span
                                                            className={cn(
                                                                'rounded-full px-2 py-0.5 font-medium',
                                                                row.returned_to_stores ===
                                                                    'Yes'
                                                                    ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300'
                                                                    : 'bg-muted text-muted-foreground',
                                                            )}
                                                            title="Returned to stores"
                                                        >
                                                            Stores{' '}
                                                            {compactYesNo(
                                                                row.returned_to_stores,
                                                            )}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <ListRowActions
                                                    viewHref={
                                                        row.old_pc_return_id
                                                            ? `/pc-handover/${row.old_pc_return_id}/edit`
                                                            : `/pc-register/${row.id}`
                                                    }
                                                    editHref={
                                                        row.old_pc_return_id
                                                            ? `/pc-handover/${row.old_pc_return_id}/edit`
                                                            : meta.can_create
                                                              ? '/pc-handover/create'
                                                              : undefined
                                                    }
                                                    itemLabel={row.ref_no}
                                                    showEdit={meta.can_create}
                                                    showDelete={false}
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
                    path="/pc-handover"
                    query={{
                        q: filters.q || undefined,
                        status: filters.status || undefined,
                    }}
                />
            </motion.div>
        </>
    );
}

PcHandoverIndex.layout = {
    title: 'PC Handover',
};
