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
                'inline-flex max-w-full items-start gap-2 rounded-full border border-sky-500/35',
                'bg-gradient-to-r from-sky-500/12 to-sky-500/5 text-sky-950 dark:text-sky-50',
                compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm',
            )}
            title="You oversee the register; another role must sign this form."
        >
            <ClipboardList
                className={cn(
                    'shrink-0 text-sky-700 dark:text-sky-300',
                    compact ? 'mt-0.5 size-3.5' : 'mt-0.5 size-4',
                )}
                aria-hidden
            />
            <span className="min-w-0 text-left leading-snug">
                <span className="font-semibold">
                    {oversight.stage_label} — {oversight.stage_description}
                </span>
                <span className="block text-[11px] font-medium uppercase tracking-wide text-sky-800/75 dark:text-sky-200/75">
                    Monitoring only
                </span>
                {awaiting && (
                    <span className="mt-0.5 block text-xs font-medium normal-case tracking-normal text-sky-900/90 dark:text-sky-100/90">
                        Awaiting {awaiting}
                    </span>
                )}
            </span>
        </div>
    );
}
