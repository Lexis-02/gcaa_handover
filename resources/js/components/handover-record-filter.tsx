import { router } from '@inertiajs/react';
import { cn } from '@/lib/utils';

export type HandoverFilterValue = '' | 'recorded' | 'pending';

const FILTERS: { value: HandoverFilterValue; label: string }[] = [
    { value: '', label: 'All' },
    { value: 'recorded', label: 'Old PC recorded' },
    { value: 'pending', label: 'Pending details' },
];

type HandoverRecordFilterProps = {
    value: HandoverFilterValue;
    search?: string;
    className?: string;
    appearance?: 'boxed' | 'plain';
};

export function HandoverRecordFilter({
    value,
    search,
    className,
    appearance = 'plain',
}: HandoverRecordFilterProps) {
    const apply = (status: HandoverFilterValue) => {
        const params: Record<string, string> = {};

        if (search?.trim()) {
            params.q = search.trim();
        }

        if (status) {
            params.status = status;
        }

        router.get('/pc-handover', params, {
            preserveState: true,
            preserveScroll: false,
        });
    };

    return (
        <div
            className={cn(
                'inline-flex flex-wrap gap-1 rounded-lg p-1',
                appearance === 'boxed'
                    ? 'border border-border/60 bg-muted/30'
                    : 'bg-muted/40',
                className,
            )}
            role="tablist"
            aria-label="Filter by old PC return status"
        >
            {FILTERS.map((filter) => {
                const active = value === filter.value;

                return (
                    <button
                        key={filter.value || 'all'}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => apply(filter.value)}
                        className={cn(
                            'rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors',
                            active
                                ? 'bg-card text-foreground shadow-sm'
                                : 'text-muted-foreground hover:bg-card/60 hover:text-foreground',
                        )}
                    >
                        {filter.label}
                    </button>
                );
            })}
        </div>
    );
}
