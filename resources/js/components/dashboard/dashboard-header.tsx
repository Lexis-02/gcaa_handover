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
            className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
            variants={pageStagger}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={pageItem} className="min-w-0 flex-1">
                <p className="text-sm font-medium text-primary">
                    {meta.greeting}
                </p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                    Hello, {firstName}
                </h1>
                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                    {meta.subtitle}
                </p>
                <motion.span
                    className="mt-3 inline-flex rounded-lg border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15, duration: 0.3 }}
                >
                    {formatRoleLabel(role)} · {meta.title}
                </motion.span>
            </motion.div>

            <motion.div variants={pageItem} className="shrink-0">
                <DashboardDateFilter />
            </motion.div>
        </motion.div>
    );
}
