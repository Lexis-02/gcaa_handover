import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { pageItem } from '@/lib/motion';
import type { DashboardStats } from '@/types';

type RoleInsightCardProps = {
    stats: DashboardStats;
};

export function RoleInsightCard({ stats }: RoleInsightCardProps) {
    const { insight, summary } = stats;
    const pending =
        summary.pending_stage_1 +
        summary.pending_stage_2 +
        summary.pending_stage_3;

    return (
        <motion.div
            variants={pageItem}
            className="flex h-full flex-col justify-between rounded-2xl border border-primary/20 bg-primary/5 p-6"
        >
            <div>
                <div className="mb-3 flex items-center gap-2 text-primary">
                    <Sparkles className="size-5" />
                    <span className="text-sm font-semibold">{insight.title}</span>
                </div>
                <p className="text-lg font-semibold leading-snug text-foreground">
                    {insight.body}
                </p>
                <p className="mt-4 font-mono text-3xl font-bold text-foreground">
                    {pending}
                </p>
                <p className="text-sm text-muted-foreground">
                    items need attention in your scope
                </p>
            </div>
            <Button
                asChild
                size="sm"
                className="mt-6 w-fit rounded-xl"
            >
                <Link href={insight.href}>
                    {insight.cta}
                    <ArrowRight className="size-4" />
                </Link>
            </Button>
        </motion.div>
    );
}
