import { router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type PaginationMeta = {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

type SmartPaginationProps = {
    meta: PaginationMeta;
    /** Route path, e.g. `/pc-register` */
    path: string;
    /** Query params to preserve (search, filters, etc.) */
    query?: Record<string, string | number | undefined | null>;
    className?: string;
    preserveScroll?: boolean;
};

function pageRange(
    current: number,
    last: number,
): (number | 'ellipsis-start' | 'ellipsis-end')[] {
    if (last <= 7) {
        return Array.from({ length: last }, (_, i) => i + 1);
    }

    const pages: (number | 'ellipsis-start' | 'ellipsis-end')[] = [1];

    if (current > 3) {
        pages.push('ellipsis-start');
    }

    const start = Math.max(2, current - 1);
    const end = Math.min(last - 1, current + 1);

    for (let p = start; p <= end; p++) {
        pages.push(p);
    }

    if (current < last - 2) {
        pages.push('ellipsis-end');
    }

    if (last > 1) {
        pages.push(last);
    }

    return pages;
}

export function SmartPagination({
    meta,
    path,
    query = {},
    className,
    preserveScroll = true,
}: SmartPaginationProps) {
    const { current_page, last_page, per_page, total } = meta;

    if (last_page <= 1) {
        return null;
    }

    const from = total === 0 ? 0 : (current_page - 1) * per_page + 1;
    const to = Math.min(current_page * per_page, total);

    const goToPage = (page: number) => {
        const params: Record<string, string | number> = {};

        Object.entries(query).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params[key] = value;
            }
        });

        if (page > 1) {
            params.page = page;
        }

        router.get(path, params, {
            preserveState: true,
            preserveScroll,
            replace: false,
        });
    };

    const pages = pageRange(current_page, last_page);

    return (
        <nav
            className={cn(
                'flex flex-col gap-3 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-between',
                className,
            )}
            aria-label="Pagination"
        >
            <p className="text-sm text-muted-foreground">
                Showing{' '}
                <span className="font-medium text-foreground">{from}</span>
                {' – '}
                <span className="font-medium text-foreground">{to}</span>
                {' of '}
                <span className="font-medium text-foreground">{total}</span>
            </p>

            <div className="flex flex-wrap items-center gap-1">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1 px-2.5"
                    disabled={current_page <= 1}
                    onClick={() => goToPage(current_page - 1)}
                    aria-label="Previous page"
                >
                    <ChevronLeft className="size-4" />
                    <span className="hidden sm:inline">Prev</span>
                </Button>

                {pages.map((page, index) => {
                    if (page === 'ellipsis-start' || page === 'ellipsis-end') {
                        return (
                            <span
                                key={`${page}-${index}`}
                                className="px-2 text-sm text-muted-foreground"
                            >
                                …
                            </span>
                        );
                    }

                    const isActive = page === current_page;

                    return (
                        <Button
                            key={page}
                            type="button"
                            variant={isActive ? 'default' : 'outline'}
                            size="sm"
                            className={cn(
                                'size-8 min-w-8 p-0 font-medium',
                                isActive && 'pointer-events-none',
                            )}
                            onClick={() => !isActive && goToPage(page)}
                            aria-label={`Page ${page}`}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            {page}
                        </Button>
                    );
                })}

                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1 px-2.5"
                    disabled={current_page >= last_page}
                    onClick={() => goToPage(current_page + 1)}
                    aria-label="Next page"
                >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="size-4" />
                </Button>
            </div>
        </nav>
    );
}
