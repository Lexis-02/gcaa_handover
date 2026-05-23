import { usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Calendar, Download, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { last30DaysLabel } from '@/lib/date';
import { pageItem, pageStagger } from '@/lib/motion';
import type { DashboardMeta } from '@/types';

type DashboardHeaderProps = {
    meta: DashboardMeta;
    roleLabel: string;
};

const roleLabels: Record<string, string> = {
    super_admin: 'Super Admin',
    ict_admin: 'ICT Admin',
    stores_officer: 'Stores Officer',
    director: 'Director',
    end_user: 'End User',
    auditor: 'Auditor',
};

export function DashboardHeader({ meta, roleLabel }: DashboardHeaderProps) {
    const { auth } = usePage().props;
    const firstName = auth.user?.name?.split(' ')[0] ?? 'there';

    return (
        <motion.div
            className="flex flex-col gap-6"
            variants={pageStagger}
            initial="hidden"
            animate="visible"
        >
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
                <motion.div variants={pageItem}>
                    <p className="text-sm font-medium text-primary">
                        {meta.greeting}
                    </p>
                    <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                        {firstName}, {meta.title}
                    </h1>
                    <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                        {meta.subtitle}
                    </p>
                    <motion.span
                        className="mt-3 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                    >
                        {roleLabel}
                    </motion.span>
                </motion.div>
                <motion.div
                    variants={pageItem}
                    className="flex flex-wrap items-center gap-2"
                >
                    <div className="relative hidden sm:block">
                        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            className="h-10 w-56 rounded-xl border-border/80 bg-card pl-9 md:w-64"
                            placeholder="Search PCs, batches…"
                            disabled
                        />
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="hidden rounded-xl md:inline-flex"
                        disabled
                    >
                        <Calendar className="size-4 shrink-0" />
                        <span className="truncate">{last30DaysLabel()}</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl"
                        disabled
                    >
                        <Plus className="size-4" />
                        Quick action
                    </Button>
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Button size="sm" className="rounded-xl shadow-sm">
                            <Download className="size-4" />
                            Export
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
}

export function formatRoleLabel(role: string): string {
    return roleLabels[role] ?? role.replace(/_/g, ' ');
}
