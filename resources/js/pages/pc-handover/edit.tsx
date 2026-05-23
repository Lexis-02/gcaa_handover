import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { pageEnter } from '@/lib/motion';
import {
    HandoverForm,
    type HandoverFormData,
    type HandoverFormOptions,
} from '@/pages/pc-handover/handover-form';

type PageProps = {
    record: HandoverFormData & { id: number };
    options: Pick<HandoverFormOptions, 'old_pc_conditions' | 'yes_no_options'>;
};

export default function PcHandoverEdit({ record, options }: PageProps) {
    return (
        <>
            <Head title={`Edit ${record.ref_no ?? 'handover'}`} />
            <motion.div
                className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-4 md:p-6"
                variants={pageEnter}
                initial="hidden"
                animate="visible"
            >
                <HandoverForm
                    action={`/pc-handover/${record.id}`}
                    method="put"
                    record={record}
                    options={options}
                    submitLabel="Save changes"
                />

                <Link
                    href="/pc-handover"
                    className="text-sm text-muted-foreground hover:text-foreground"
                >
                    ← Back to PC Handover
                </Link>
            </motion.div>
        </>
    );
}

PcHandoverEdit.layout = {
    title: 'Edit',
};
