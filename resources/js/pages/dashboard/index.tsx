import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { pageEnter } from '@/lib/motion';
import type { DashboardMeta } from '@/types';

type DashboardPageProps = {
    role: string;
    meta: DashboardMeta;
};

export default function DashboardIndex({ meta }: DashboardPageProps) {
    return (
        <>
            <Head title={meta.title} />
            <motion.div
                className="flex flex-1 flex-col p-4 md:p-6"
                variants={pageEnter}
                initial="hidden"
                animate="visible"
            >
                {/* Dashboard content — build out in next sprint */}
            </motion.div>
        </>
    );
}

DashboardIndex.layout = {
    title: 'Dashboard',
};
