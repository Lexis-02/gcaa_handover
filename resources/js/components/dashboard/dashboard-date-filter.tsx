import { router, usePage } from '@inertiajs/react';
import { endOfMonth, format, parseISO, startOfMonth, subDays } from 'date-fns';
import { CalendarDays, ChevronDown } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { formatShortDate } from '@/lib/date';
import { cn } from '@/lib/utils';

type DashboardFilters = {
    from: string;
    to: string;
};

function toIsoDate(date: Date): string {
    return format(date, 'yyyy-MM-dd');
}

export function DashboardDateFilter({
    routePath = '/dashboard',
}: {
    routePath?: string;
}) {
    const { filters } = usePage<{ filters: DashboardFilters }>().props;
    const [open, setOpen] = useState(false);
    const [draftFrom, setDraftFrom] = useState(filters.from);
    const [draftTo, setDraftTo] = useState(filters.to);

    useEffect(() => {
        setDraftFrom(filters.from);
        setDraftTo(filters.to);
    }, [filters.from, filters.to]);

    const label = useMemo(() => {
        const from = parseISO(filters.from);
        const to = parseISO(filters.to);

        return `${format(from, 'MMM d')} – ${formatShortDate(to)}`;
    }, [filters.from, filters.to]);

    const applyRange = (from: Date, to: Date) => {
        router.get(
            routePath,
            { from: toIsoDate(from), to: toIsoDate(to) },
            { preserveState: true, preserveScroll: true },
        );
        setOpen(false);
    };

    const applyCustom = () => {
        if (!draftFrom || !draftTo) {
            return;
        }

        applyRange(parseISO(draftFrom), parseISO(draftTo));
    };

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        'group h-10 shrink-0 gap-2 rounded-xl border-border/80 bg-card px-3 font-normal',
                    )}
                >
                    <CalendarDays className="size-4 text-primary group-hover:text-primary-foreground" />
                    <span className="hidden sm:inline">{label}</span>
                    <span className="sm:hidden">Dates</span>
                    <ChevronDown className="size-4 opacity-60" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuLabel>Date range</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() =>
                        applyRange(subDays(new Date(), 6), new Date())
                    }
                >
                    Last 7 days
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() =>
                        applyRange(subDays(new Date(), 29), new Date())
                    }
                >
                    Last 30 days
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() =>
                        applyRange(
                            startOfMonth(new Date()),
                            endOfMonth(new Date()),
                        )
                    }
                >
                    This month
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="space-y-3 px-2 py-2">
                    <p className="text-xs font-medium text-muted-foreground">
                        Custom range
                    </p>
                    <div className="grid gap-2">
                        <label className="grid gap-1 text-xs">
                            <span className="text-muted-foreground">From</span>
                            <Input
                                type="date"
                                value={draftFrom}
                                onChange={(e) => setDraftFrom(e.target.value)}
                                className="h-9"
                            />
                        </label>
                        <label className="grid gap-1 text-xs">
                            <span className="text-muted-foreground">To</span>
                            <Input
                                type="date"
                                value={draftTo}
                                onChange={(e) => setDraftTo(e.target.value)}
                                className="h-9"
                            />
                        </label>
                    </div>
                    <Button
                        size="sm"
                        className="w-full rounded-lg"
                        onClick={applyCustom}
                    >
                        Apply range
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
