import { motion } from 'framer-motion';
import { CheckCircle2, Layers, Monitor, Percent } from 'lucide-react';
import { pageItem } from '@/lib/motion';
import { cn } from '@/lib/utils';

type Overall = {
    total_in_batch: number;
    registered: number;
    complete: number;
    percent_complete: number;
};

export function SummaryKpiCards({ overall }: { overall: Overall }) {
    const cards = [
        {
            label: 'Batch capacity',
            value: overall.total_in_batch,
            icon: Layers,
            tone: 'text-primary bg-primary/10',
        },
        {
            label: 'Registered',
            value: overall.registered,
            icon: Monitor,
            tone: 'text-sky-600 bg-sky-500/15 dark:text-sky-400',
        },
        {
            label: 'Complete',
            value: overall.complete,
            icon: CheckCircle2,
            tone: 'text-emerald-700 bg-emerald-500/15 dark:text-emerald-400',
        },
        {
            label: '% Complete',
            value: `${overall.percent_complete.toFixed(1)}%`,
            icon: Percent,
            tone: 'text-teal-700 bg-teal-500/15 dark:text-teal-400',
        },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card, index) => (
                <motion.div
                    key={card.label}
                    variants={pageItem}
                    transition={{ delay: index * 0.06 }}
                    className="rounded-xl border border-border/60 bg-card p-4 shadow-none"
                >
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                {card.label}
                            </p>
                            <p className="mt-2 font-mono text-2xl font-bold tabular-nums">
                                {card.value}
                            </p>
                        </div>
                        <div
                            className={cn(
                                'flex size-10 items-center justify-center rounded-lg',
                                card.tone,
                            )}
                        >
                            <card.icon className="size-5" />
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
