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
                'inline-flex max-w-full items-start gap-2.5 rounded-xl border border-sky-400/40 shadow-sm transition-all hover:shadow hover:-translate-y-0.5',
                'bg-gradient-to-br from-sky-50 to-sky-100/60 text-sky-950 dark:from-sky-900/30 dark:to-sky-800/10 dark:text-sky-50',
                compact ? 'px-3.5 py-2 text-xs' : 'px-5 py-3 text-sm',
            )}
            title="You oversee the register; another role must sign this form."
        >
            <div className={cn('flex items-center justify-center rounded-lg bg-sky-200/50 dark:bg-sky-700/50 p-1.5')}>
                <ClipboardList
                    className={cn(
                        'shrink-0 text-sky-600 dark:text-sky-300',
                        compact ? 'size-3.5' : 'size-4',
                    )}
                    aria-hidden
                />
            </div>
            <span className="min-w-0 text-left leading-snug">
                <span className="font-bold text-sky-900 dark:text-sky-100">
                    {oversight.stage_label} — {oversight.stage_description}
                </span>
                <span className="block mt-0.5 text-[11px] font-extrabold uppercase tracking-widest text-sky-600/90 dark:text-sky-400/90">
                    Monitoring only
                </span>
                {awaiting && (
                    <span className="mt-1 block text-xs font-medium normal-case tracking-normal text-sky-800/80 dark:text-sky-200/80">
                        Awaiting <span className="font-semibold">{awaiting}</span>
                    </span>
                )}
            </span>
        </div>
    );
}

