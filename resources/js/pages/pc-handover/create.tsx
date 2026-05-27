import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { pageEnter } from '@/lib/motion';
import {
    HandoverForm,
    type HandoverFormOptions,
} from '@/pages/pc-handover/handover-form';

type PageProps = {
    options: HandoverFormOptions;
    selected_pc_asset_id?: number | null;
};

export default function PcHandoverCreate({
    options,
    selected_pc_asset_id = null,
}: PageProps) {
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
                    record={
                        selected_pc_asset_id
                            ? { pc_asset_id: selected_pc_asset_id }
                            : undefined
                    }
                    submitLabel="Save handover details"
                    showPcSelect
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

PcHandoverCreate.layout = {
    title: 'Add',
};
