import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { confirmDelete } from '@/lib/sweetalert';
import { pageEnter } from '@/lib/motion';

type BatchDetail = {
    id: number;
    batch_code: string;
    year: number;
    total_pcs: number;
    serial_from: string;
    serial_to: string;
    notes: string | null;
    pcs_registered: number;
    created_at: string | null;
    created_by_name: string | null;
    updated_at: string | null;
};

function Field({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="space-y-1">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {label}
            </dt>
            <dd className="text-sm font-medium">{value ?? '—'}</dd>
        </div>
    );
}

export default function BatchesShow({
    batch,
    meta,
}: {
    batch: BatchDetail;
    meta: { can_edit: boolean; can_delete: boolean };
}) {
    const handleDelete = async () => {
        const confirmed = await confirmDelete(batch.batch_code);
        if (!confirmed) return;
        router.delete(`/batches/${batch.id}`);
    };

    return (
        <>
            <Head title={`${batch.batch_code} — Batch`} />
            <motion.div
                className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-4 md:p-6"
                variants={pageEnter}
                initial="hidden"
                animate="visible"
            >
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <p className="text-xs text-muted-foreground">Batch</p>
                        <h1 className="font-mono text-2xl font-bold">
                            {batch.batch_code}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {batch.pcs_registered} of {batch.total_pcs} PCs
                            registered
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {meta.can_edit && (
                            <Button asChild variant="outline">
                                <Link href={`/batches/${batch.id}/edit`}>
                                    Edit
                                </Link>
                            </Button>
                        )}
                        {meta.can_delete && (
                            <Button
                                type="button"
                                variant="destructive-outline"
                                onClick={handleDelete}
                            >
                                Delete
                            </Button>
                        )}
                        <Button asChild variant="ghost">
                            <Link href="/batches">Back</Link>
                        </Button>
                    </div>
                </div>

                <section className="rounded-xl bg-card p-6 shadow-sm ring-1 ring-border/60">
                    <dl className="grid gap-4 sm:grid-cols-2">
                        <Field label="Year" value={batch.year} />
                        <Field label="Total PCs" value={batch.total_pcs} />
                        <Field
                            label="Serial from"
                            value={`GCAA-PC-${batch.year}-${batch.serial_from}`}
                        />
                        <Field
                            label="Serial to"
                            value={`GCAA-PC-${batch.year}-${batch.serial_to}`}
                        />
                        <Field
                            label="Created by"
                            value={batch.created_by_name}
                        />
                        <Field label="Created" value={batch.created_at} />
                        <Field label="Last updated" value={batch.updated_at} />
                        <div className="sm:col-span-2">
                            <Field label="Notes" value={batch.notes} />
                        </div>
                    </dl>
                </section>

                <Button asChild variant="outline" className="w-fit">
                    <Link href="/pc-register/create">
                        Add PC to register
                    </Link>
                </Button>
            </motion.div>
        </>
    );
}

BatchesShow.layout = { title: 'View batch' };
