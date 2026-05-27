import { usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { DashboardDateFilter } from '@/components/dashboard/dashboard-date-filter';
import { pageItem, pageStagger } from '@/lib/motion';
import type { DashboardMeta } from '@/types';
import { formatRoleLabel } from './format-role-label';

type DashboardHeaderProps = {
    meta: DashboardMeta;
    role: string;
};

export function DashboardHeader({ meta, role }: DashboardHeaderProps) {
    const { auth } = usePage().props;
    const firstName = auth.user?.name?.split(' ')[0] ?? 'there';

    return (
        <motion.div
            className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-end sm:justify-between"
            variants={pageStagger}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={pageItem} className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                        {meta.greeting}, {firstName}
                    </h1>
                    <motion.span
                        className="text-sm font-medium text-muted-foreground"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.15, duration: 0.3 }}
                    >
                        {/* {formatRoleLabel(role)} · {meta.title} */}
                    </motion.span>
                </div>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                    {meta.subtitle}
                </p>
            </motion.div>

            <motion.div variants={pageItem} className="shrink-0">
                <DashboardDateFilter />
            </motion.div>
        </motion.div>
    );
}
