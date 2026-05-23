import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { DashboardStats } from '@/types';

const insights: Record<
    string,
    { title: string; body: string; cta: string }
> = {
    super_admin: {
        title: 'System health',
        body: 'Monitor completion rate and stage bottlenecks across all departments.',
        cta: 'View full reports',
    },
    ict_admin: {
        title: 'Operations focus',
        body: 'Create batches and assign PCs. Track pipeline from issue to completion.',
        cta: 'Manage batches',
    },
    stores_officer: {
        title: 'Stage 1 queue',
        body: 'PCs awaiting stores sign-off need your action before directors can approve.',
        cta: 'Open sign-off queue',
    },
    director: {
        title: 'Department approvals',
        body: 'Review Stage 2 items for your department and keep handovers moving.',
        cta: 'Pending approvals',
    },
    end_user: {
        title: 'Your handover',
        body: 'Acknowledge receipt and submit old PC return when prompted.',
        cta: 'Continue handover',
    },
    auditor: {
        title: 'Compliance view',
        body: 'Read-only access to assets, reports, and audit trails for verification.',
        cta: 'Open audit log',
    },
};

type RoleInsightCardProps = {
    role: string;
    stats: DashboardStats;
};

export function RoleInsightCard({ role, stats }: RoleInsightCardProps) {
    const insight = insights[role] ?? insights.end_user;
    const pending =
        stats.summary.pending_stage_1 +
        stats.summary.pending_stage_2 +
        stats.summary.pending_stage_3;

    return (
        <div
            className="dashboard-card flex h-full flex-col justify-between rounded-2xl p-6 text-primary-foreground"
            style={{ background: 'var(--dashboard-gradient)' }}
        >
            <div>
                <div className="mb-3 flex items-center gap-2">
                    <Sparkles className="size-5 opacity-90" />
                    <span className="text-sm font-medium opacity-90">
                        {insight.title}
                    </span>
                </div>
                <p className="text-lg font-semibold leading-snug">
                    {insight.body}
                </p>
                <p className="mt-4 text-3xl font-bold">{pending}</p>
                <p className="text-sm opacity-80">items need attention</p>
            </div>
            <Button
                variant="secondary"
                size="sm"
                className="mt-6 w-fit rounded-xl border-0 bg-white/20 text-white hover:bg-white/30"
                disabled
            >
                {insight.cta}
                <ArrowRight className="size-4" />
            </Button>
        </div>
    );
}
