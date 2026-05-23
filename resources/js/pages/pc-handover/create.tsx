import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { pageEnter } from '@/lib/motion';
import {
    HandoverForm,
    type HandoverFormOptions,
} from '@/pages/pc-handover/handover-form';

type PageProps = {
    options: HandoverFormOptions;
};

export default function PcHandoverCreate({ options }: PageProps) {
    return (
        <>
            <Head title="Add PC handover" />
            <motion.div
                className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-4 md:p-6"
                variants={pageEnter}
                initial="hidden"
                animate="visible"
            >
                <p className="text-sm text-muted-foreground">
                    Record details for the old PC being replaced. The new PC
                    must already be in the register with an assigned end user.{' '}
                    <Link
                        href="/pc-handover"
                        className="text-primary hover:underline"
                    >
                        Back to PC Handover
                    </Link>
                </p>

                <HandoverForm
                    action="/pc-handover"
                    method="post"
                    options={options}
                    submitLabel="Save handover details"
                    showPcSelect
                />
            </motion.div>
        </>
    );
}

PcHandoverCreate.layout = {
    title: 'Add PC handover',
};
