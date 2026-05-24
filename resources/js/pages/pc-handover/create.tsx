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
            <Head title="Add old PC details" />
            <motion.div
                className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-4 md:p-6"
                variants={pageEnter}
                initial="hidden"
                animate="visible"
            >
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
    title: 'Add',
};
