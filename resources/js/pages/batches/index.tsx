import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { pageEnter } from '@/lib/motion';

type BatchRecord = {
    id: number;
    batch_code: string;
    year: number;
    total_pcs: number;
    serial_from: string;
    serial_to: string;
    notes: string | null;
    pcs_registered: number;
    created_at: string | null;
};

type PageProps = {
    batches: BatchRecord[];
    meta: { can_create: boolean };
};

export default function BatchesIndex({ batches, meta }: PageProps) {
    return (
        <>
            <Head title="Handover batches" />
            <motion.div
                className="flex flex-1 flex-col gap-4 p-4 md:p-6"
                variants={pageEnter}
                initial="hidden"
                animate="visible"
            >
                <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
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
                                </tr>
                            </thead>
                            <tbody>
                                {batches.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-4 py-12 text-center text-muted-foreground"
                                        >
                                            No batches yet.
                                            {meta.can_create && (
                                                <>
                                                    {' '}
                                                    <Link
                                                        href="/batches/create"
                                                        className="font-medium text-primary underline-offset-4 hover:underline"
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
                                            <td className="px-4 py-3 font-mono font-medium">
                                                {batch.batch_code}
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
