import { router } from '@inertiajs/react';
import { cn } from '@/lib/utils';

export type StatusFilterValue = '' | 'pending' | 'sign-off' | 'complete';

const FILTERS: { value: StatusFilterValue; label: string }[] = [
    { value: '', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'sign-off', label: 'In sign-off' },
    { value: 'complete', label: 'Complete' },
];

type RegisterStatusFilterProps = {
    value: StatusFilterValue;
    search?: string;
    className?: string;
    /** Plain = no outer box border (for toolbar alignment) */
    appearance?: 'boxed' | 'plain';
};

export function RegisterStatusFilter({
    value,
    search,
    className,
    appearance = 'plain',
}: RegisterStatusFilterProps) {
    const apply = (status: StatusFilterValue) => {
        const params: Record<string, string> = {};

        if (search?.trim()) {
            params.q = search.trim();
        }

        if (status) {
            params.status = status;
        }

        router.get('/pc-register', params, {
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
            aria-label="Filter by handover status"
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
