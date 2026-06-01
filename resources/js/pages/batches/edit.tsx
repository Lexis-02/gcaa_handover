import { Form, Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { FormInput } from '@/components/form-input';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { pageEnter } from '@/lib/motion';
import { cn } from '@/lib/utils';

type BatchRecord = {
    id: number;
    batch_code: string;
    year: number;
    total_pcs: number;
    serial_from: string;
    serial_to: string;
    notes: string | null;
};

const selectClassName = cn(
    'h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-sm',
    'text-slate-900 outline-none transition-all duration-300',
    'focus:border-accent/80 focus:bg-white focus:ring-4 focus:ring-accent/10',
    'dark:border-slate-800/80 dark:bg-slate-950/40 dark:text-slate-100',
);

export default function BatchesEdit({
    batch,
    meta,
}: {
    batch: BatchRecord;
    meta: { has_pcs: boolean };
}) {
    return (
        <>
            <Head title={`Edit ${batch.batch_code}`} />
            <motion.div
                className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 p-4 md:p-6"
                variants={pageEnter}
                initial="hidden"
                animate="visible"
            >
                <p className="text-sm text-muted-foreground">
                    Batch code <strong>{batch.batch_code}</strong> and year{' '}
                    {batch.year} cannot be changed. Updating totals recalculates
                    the serial range used for new register entries.
                </p>

                {meta.has_pcs && (
                    <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-950 dark:text-amber-100">
                        This batch already has PCs registered — total cannot be
                        set below the current count.
                    </p>
                )}

                <Form
                    action={`/batches/${batch.id}`}
                    method="put"
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <FormInput
                                id="total_pcs"
                                label="Total PCs in batch"
                                name="total_pcs"
                                type="number"
                                required
                                min={1}
                                max={999}
                                defaultValue={String(batch.total_pcs)}
                                error={errors.total_pcs}
                            />

                            <FormInput
                                id="serial_from"
                                label="Serial sequence starts at"
                                name="serial_from"
                                required
                                defaultValue={batch.serial_from}
                                error={errors.serial_from}
                            />

                            <div className="space-y-2">
                                <Label htmlFor="notes" className="text-sm font-medium">
                                    Notes (optional)
                                </Label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    rows={3}
                                    defaultValue={batch.notes ?? ''}
                                    className={cn(selectClassName, 'h-auto py-2')}
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <Button type="submit" variant="success" disabled={processing}>
                                    <Save className="size-4" />
                                    Save changes
                                </Button>
                                <Button asChild variant="secondary">
                                    <Link href={`/batches/${batch.id}`}>Cancel</Link>
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </motion.div>
        </>
    );
}

BatchesEdit.layout = { title: 'Edit batch' };
