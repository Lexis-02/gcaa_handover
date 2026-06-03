import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export type StageProgress = {
    stage_1: boolean;
    stage_2: boolean;
    stage_3: boolean;
    old_pc_returned: boolean;
    old_pc_return_action?: string | null;
    complete: boolean;
};

export function HandoverStageProgress({
    progress,
    compact = false,
}: {
    progress: StageProgress;
    compact?: boolean;
}) {
    const pcTitle = progress.old_pc_return_action === 'given_to_user' ? 'Old PC reassigned' : 'Old PC returned';

    const steps = [
        { key: 'stage_1' as const, short: '1', title: 'ICT / Form 1' },
        { key: 'stage_2' as const, short: '2', title: 'Director / Form 2' },
        { key: 'stage_3' as const, short: '3', title: 'End user / Form 3' },
        { key: 'old_pc_returned' as const, short: 'PC', title: pcTitle },
    ];
    return (
        <div
            className={cn(
                'flex items-center gap-1',
                compact ? 'gap-0.5' : 'gap-1.5',
            )}
            title="Handover stage progress"
        >
            {steps.map((step, index) => {
                const done = progress[step.key];
                const prevDone =
                    index === 0 ? true : progress[steps[index - 1].key];
                const current = !done && prevDone;

                return (
                    <div key={step.key} className="flex items-center gap-1">
                        {index > 0 && (
                            <span
                                className={cn(
                                    'h-px w-2 sm:w-3',
                                    done || current
                                        ? 'bg-primary/50'
                                        : 'bg-border',
                                )}
                            />
                        )}
                        <span
                            title={step.title}
                            className={cn(
                                'inline-flex items-center justify-center rounded-full border font-medium',
                                compact
                                    ? 'size-6 text-[10px]'
                                    : 'size-7 text-xs',
                                done &&
                                    'border-emerald-500/40 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
                                current &&
                                    'border-amber-500/50 bg-amber-500/15 text-amber-800 dark:text-amber-300',
                                !done &&
                                    !current &&
                                    'border-border bg-muted/50 text-muted-foreground',
                            )}
                        >
                            {done ? (
                                <Check
                                    className={compact ? 'size-3' : 'size-3.5'}
                                    strokeWidth={2.5}
                                />
                            ) : (
                                step.short
                            )}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
