import { ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';

export type HandoverOversight = {
    stage: number;
    stage_label: string;
    stage_description: string;
    form_ref: string;
};

export function HandoverOversightBadge({
    oversight,
    awaiting,
    size = 'default',
}: {
    oversight: HandoverOversight;
    awaiting: string | null;
    size?: 'default' | 'sm';
}) {
    const compact = size === 'sm';

    return (
        <div
            className={cn(
                'inline-flex max-w-full items-start gap-3 rounded-xl border border-sky-500/20',
                'bg-sky-50/50 text-sky-950 shadow-sm dark:bg-sky-500/10 dark:text-sky-50',
                compact ? 'px-3 py-2 text-xs' : 'px-4 py-3 text-sm',
            )}
            title="You oversee the register; another role must sign this form."
        >
            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400">
                <ClipboardList className="size-4" aria-hidden />
            </div>
            <div className="flex min-w-0 flex-col py-0.5">
                <span className="font-semibold text-sky-900 dark:text-sky-100">
                    {oversight.stage_label} — {oversight.stage_description}
                </span>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <span className="inline-flex rounded-md bg-sky-100/80 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-700 dark:bg-sky-500/20 dark:text-sky-300">
                        Monitoring only
                    </span>
                    {awaiting && (
                        <span className="text-xs font-medium text-sky-700/80 dark:text-sky-300/80">
                            Awaiting {awaiting}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
