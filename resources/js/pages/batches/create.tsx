import { Form, Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { FormInput } from '@/components/form-input';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { pageEnter } from '@/lib/motion';
import { cn } from '@/lib/utils';

type PageProps = {
    defaults: {
        year: number;
        total_pcs: number;
        serial_from: string;
    };
};

const formLabelClassName = 'text-sm font-medium text-foreground select-none';

const selectClassName = cn(
    'h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-sm',
    'text-slate-900 outline-none transition-all duration-300',
    'focus:border-accent/80 focus:bg-white focus:ring-4 focus:ring-accent/10',
    'dark:border-slate-800/80 dark:bg-slate-950/40 dark:text-slate-100',
);

export default function BatchesCreate({ defaults }: PageProps) {
    return (
        <>
            <Head title="Create batch" />
            <motion.div
                className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 p-4 md:p-6"
                variants={pageEnter}
                initial="hidden"
                animate="visible"
            >
                <p className="text-sm text-muted-foreground">
                    A batch defines the handover year, how many PCs are in the
                    cycle, and the serial reference range (e.g. GCAA-PC-2026-001
                    to 056). Create a batch before adding PCs in the register.
                </p>

                <Form
                    action="/batches"
                    method="post"
                    className="space-y-6"
                    options={{ preserveScroll: true }}
                >
                    {({ processing, errors }) => (
                        <>
                            <FormInput
                                id="year"
                                label="Handover year"
                                name="year"
                                type="number"
                                required
                                min={2020}
                                max={2100}
                                defaultValue={String(defaults.year)}
                                error={errors.year}
                            />

                            <FormInput
                                id="total_pcs"
                                label="Total PCs in batch"
                                name="total_pcs"
                                type="number"
                                required
                                min={1}
                                max={999}
                                defaultValue={String(defaults.total_pcs)}
                                error={errors.total_pcs}
                            />

                            <FormInput
                                id="serial_from"
                                label="Serial sequence starts at"
                                name="serial_from"
                                required
                                placeholder="001"
                                defaultValue={defaults.serial_from}
                                error={errors.serial_from}
                            />

                            <div className="space-y-2">
                                <Label
                                    htmlFor="notes"
                                    className={formLabelClassName}
                                >
                                    Notes (optional)
                                </Label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    rows={3}
                                    className={cn(
                                        selectClassName,
                                        'h-auto py-2',
                                    )}
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <Button type="submit" disabled={processing}>
                                    <Save className="size-4" />
                                    Create batch
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href="/batches">Cancel</Link>
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </motion.div>
        </>
    );
}

BatchesCreate.layout = {
    title: 'Add batch',
};
