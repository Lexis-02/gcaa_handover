import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
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
    old_asset_tag: string | null;
    old_make_model: string | null;
    old_serial_no: string | null;
    year_of_purchase: number | null;
    condition: string | null;
    reason_for_replacement: string | null;
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
    filters: { q: string };
    meta: { can_create: boolean };
};

function cell(value: string | number | null | undefined): string {
    if (value === null || value === undefined || value === '') {
        return '—';
    }

    return String(value);
}

function triStateTone(value: string | null): string {
    switch (value) {
        case 'Yes':
            return 'text-emerald-700 dark:text-emerald-300';
        case 'No':
            return 'text-destructive';
        case 'N/A':
            return 'text-muted-foreground';
        default:
            return 'text-muted-foreground';
    }
}

export default function PcHandoverIndex({
    records,
    filters,
    meta,
}: PageProps) {
    const hasSearch = filters.q.trim().length > 0;

    return (
        <>
            <Head title="PC Handover" />
            <motion.div
                className="mx-auto flex w-full max-w-[96rem] flex-1 flex-col gap-4 p-4 md:p-6"
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
                        {hasSearch && (
                            <>
                                {' · '}
                                <Link
                                    href="/pc-handover"
                                    className="text-primary hover:underline"
                                    preserveScroll
                                >
                                    Clear search
                                </Link>
                            </>
                        )}
                    </div>
                    {meta.can_create && (
                        <Link
                            href="/pc-handover/create"
                            className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                        >
                            Add old PC details
                        </Link>
                    )}
                </div>

                <form
                    method="get"
                    action="/pc-handover"
                    className="flex gap-2"
                >
                    <input
                        type="search"
                        name="q"
                        defaultValue={filters.q}
                        placeholder="Search ref, user, department, old PC…"
                        className="h-10 min-w-0 flex-1 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/30"
                    />
                    <button
                        type="submit"
                        className="inline-flex h-10 shrink-0 items-center rounded-lg border border-border bg-card px-4 text-sm font-medium hover:bg-muted/50"
                    >
                        Search
                    </button>
                </form>

                <div className="overflow-hidden rounded-xl bg-card shadow-sm ring-1 ring-border/60">
                    <div className="custom-scrollbar overflow-x-auto">
                        <table className="w-full min-w-[72rem] border-collapse text-sm">
                            <thead>
                                <tr className="border-b bg-muted/40 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    <th className="w-10 px-3 py-3">#</th>
                                    <th className="px-3 py-3">
                                        Serial / Ref No.
                                        <span className="mt-0.5 block font-normal normal-case text-muted-foreground/80">
                                            (New PC)
                                        </span>
                                    </th>
                                    <th className="px-3 py-3">End-user name</th>
                                    <th className="px-3 py-3">Department</th>
                                    <th className="px-3 py-3">Old asset tag</th>
                                    <th className="px-3 py-3">Old make / model</th>
                                    <th className="px-3 py-3">Old serial no.</th>
                                    <th className="px-3 py-3">Year of purchase</th>
                                    <th className="px-3 py-3">Condition</th>
                                    <th className="min-w-[8rem] px-3 py-3">
                                        Reason for replacement
                                    </th>
                                    <th className="px-3 py-3">Data wiped?</th>
                                    <th className="px-3 py-3">
                                        Returned to stores?
                                    </th>
                                    <th className="px-3 py-3 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={13}
                                            className="px-4 py-12 text-center text-muted-foreground"
                                        >
                                            {hasSearch
                                                ? 'No handover records match your search.'
                                                : 'No PCs in the handover register yet.'}
                                        </td>
                                    </tr>
                                ) : (
                                    records.data.map((row) => (
                                        <tr
                                            key={row.id}
                                            className="border-b border-border/40 align-top hover:bg-muted/20"
                                        >
                                            <td className="px-3 py-3 text-xs text-muted-foreground">
                                                {row.row_number}
                                            </td>
                                            <td className="px-3 py-3">
                                                <Link
                                                    href={`/pc-register/${row.id}`}
                                                    className="font-mono text-xs font-semibold text-primary hover:underline"
                                                >
                                                    {row.ref_no}
                                                </Link>
                                                <p className="mt-0.5 text-xs text-muted-foreground">
                                                    {row.new_serial_number}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {row.new_make_model}
                                                </p>
                                            </td>
                                            <td className="px-3 py-3">
                                                {cell(row.end_user_name)}
                                            </td>
                                            <td className="px-3 py-3">
                                                {cell(row.department?.name)}
                                            </td>
                                            <td className="px-3 py-3 font-mono text-xs">
                                                {cell(row.old_asset_tag)}
                                            </td>
                                            <td className="px-3 py-3">
                                                {cell(row.old_make_model)}
                                            </td>
                                            <td className="px-3 py-3 font-mono text-xs">
                                                {cell(row.old_serial_no)}
                                            </td>
                                            <td className="px-3 py-3">
                                                {cell(row.year_of_purchase)}
                                            </td>
                                            <td className="px-3 py-3">
                                                {cell(row.condition)}
                                            </td>
                                            <td className="max-w-[12rem] px-3 py-3 text-xs leading-relaxed">
                                                {row.reason_for_replacement ? (
                                                    <span className="line-clamp-3">
                                                        {
                                                            row.reason_for_replacement
                                                        }
                                                    </span>
                                                ) : (
                                                    '—'
                                                )}
                                            </td>
                                            <td className="px-3 py-3">
                                                <span
                                                    className={cn(
                                                        'text-xs font-medium',
                                                        triStateTone(
                                                            row.data_wiped,
                                                        ),
                                                    )}
                                                >
                                                    {cell(row.data_wiped)}
                                                </span>
                                            </td>
                                            <td className="px-3 py-3">
                                                <span
                                                    className={cn(
                                                        'text-xs font-medium',
                                                        triStateTone(
                                                            row.returned_to_stores,
                                                        ),
                                                    )}
                                                >
                                                    {cell(
                                                        row.returned_to_stores,
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-3 py-3">
                                                <ListRowActions
                                                    viewHref={`/pc-register/${row.id}`}
                                                    editHref={
                                                        row.old_pc_return_id
                                                            ? `/pc-handover/${row.old_pc_return_id}/edit`
                                                            : undefined
                                                    }
                                                    showEdit={
                                                        meta.can_create &&
                                                        row.can_edit
                                                    }
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
                    query={{ q: filters.q || undefined }}
                />
            </motion.div>
        </>
    );
}

PcHandoverIndex.layout = {
    title: 'PC Handover',
};
