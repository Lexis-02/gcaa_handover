import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ListRowActions } from '@/components/list-row-actions';
import { PageSearchInput } from '@/components/page-search-input';
import { pageEnter } from '@/lib/motion';

type BatchRecord = {
    id: number;
    batch_code: string;
    year: number;
    total_pcs: number;
    serial_from: string;
    serial_to: string;
    pcs_registered: number;
    created_at: string | null;
    can_edit: boolean;
    can_delete: boolean;
};

export default function BatchesIndex({
    batches,
    filters,
    meta,
}: {
    batches: BatchRecord[];
    filters: { q: string };
    meta: { can_create: boolean };
}) {
    const hasSearch = filters?.q?.trim().length > 0;
    return (
        <>
            <Head title="Handover batches" />
            <motion.div
                className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 p-4 md:p-6"
                variants={pageEnter}
                initial="hidden"
                animate="visible"
            >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <PageSearchInput 
                        value={filters?.q ?? ''}
                        routePath="/batches"
                        placeholder="Search batch code, year, or notes..."
                    />

                    {meta.can_create && (
                        <div className="flex justify-end">
                            <Link
                                href="/batches/create"
                                className="inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                            >
                                Add batch
                            </Link>
                        </div>
                    )}
                </div>

                <div className="overflow-hidden rounded-xl bg-card shadow-sm ring-1 ring-border/60">
                    <div className="custom-scrollbar overflow-x-auto">
                        <table className="w-full border-collapse text-sm">
                            <thead>
                                <tr className="border-b bg-muted/40 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    <th className="px-4 py-3">Batch code</th>
                                    <th className="px-4 py-3">Year</th>
                                    <th className="px-4 py-3">Total PCs</th>
                                    <th className="px-4 py-3">Serial range</th>
                                    <th className="px-4 py-3">Registered</th>
                                    <th className="px-4 py-3">Created</th>
                                    <th className="px-4 py-3 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {batches.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-4 py-12 text-center text-muted-foreground"
                                        >
                                            {hasSearch 
                                                ? 'No batches match your search.'
                                                : 'No batches yet.'}
                                            {!hasSearch && meta.can_create && (
                                                <>
                                                    {' '}
                                                    <Link
                                                        href="/batches/create"
                                                        className="font-medium text-primary hover:underline"
                                                    >
                                                        Create the first batch
                                                    </Link>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ) : (
                                    batches.map((batch) => (
                                        <tr
                                            key={batch.id}
                                            className="border-b border-border/40 hover:bg-muted/20"
                                        >
                                            <td className="px-4 py-3">
                                                <Link
                                                    href={`/batches/${batch.id}`}
                                                    className="font-mono font-medium text-primary hover:underline"
                                                >
                                                    {batch.batch_code}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3">
                                                {batch.year}
                                            </td>
                                            <td className="px-4 py-3">
                                                {batch.total_pcs}
                                            </td>
                                            <td className="px-4 py-3 font-mono text-xs">
                                                GCAA-PC-{batch.year}-
                                                {batch.serial_from} …{' '}
                                                {batch.serial_to}
                                            </td>
                                            <td className="px-4 py-3">
                                                {batch.pcs_registered} /{' '}
                                                {batch.total_pcs}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {batch.created_at ?? '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <ListRowActions
                                                    viewHref={`/batches/${batch.id}`}
                                                    editHref={`/batches/${batch.id}/edit`}
                                                    deleteUrl={`/batches/${batch.id}`}
                                                    itemLabel={batch.batch_code}
                                                    showEdit={batch.can_edit}
                                                    showDelete={batch.can_delete}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>
        </>
    );
}

BatchesIndex.layout = {
    title: 'Batches',
};
