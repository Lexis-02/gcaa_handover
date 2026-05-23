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
            <Head title="Edit PC handover" />
            <motion.div
                className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-4 md:p-6"
                variants={pageEnter}
                initial="hidden"
                animate="visible"
            >
                <p className="text-sm text-muted-foreground">
                    Update old PC return details for this handover.{' '}
                    <Link
                        href="/pc-handover"
                        className="text-primary hover:underline"
                    >
                        Back to PC Handover
                    </Link>
                </p>

                <HandoverForm
                    action={`/pc-handover/${record.id}`}
                    method="put"
                    record={record}
                    options={options}
                    submitLabel="Update handover details"
                />
            </motion.div>
        </>
    );
}

PcHandoverEdit.layout = {
    title: 'Edit PC handover',
};
