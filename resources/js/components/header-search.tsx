import { router, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useSearchShortcut } from '@/hooks/use-search-shortcut';
import { cn } from '@/lib/utils';

type HeaderSearchProps = {
    className?: string;
    placeholder?: string;
};

type ListPageFilters = {
    filters?: { q?: string; status?: string };
};

const REGISTER_SEARCH_PATH = '/pc-register';
const HANDOVER_SEARCH_PATH = '/pc-handover';

type SearchableList = 'register' | 'handover' | null;

function resolveListPage(component: string, urlPath: string): SearchableList {
    if (
        component === 'pc-register/index' ||
        urlPath === REGISTER_SEARCH_PATH
    ) {
        return 'register';
    }

    if (
        component === 'pc-handover/index' ||
        urlPath === HANDOVER_SEARCH_PATH
    ) {
        return 'handover';
    }

    return null;
}

export function HeaderSearch({
    className,
    placeholder,
}: HeaderSearchProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const page = usePage<ListPageFilters>();
    const urlPath = page.url.split('?')[0];
    const listPage = resolveListPage(page.component, urlPath);
    const queryFromServer = listPage
        ? (page.props.filters?.q ?? '')
        : '';
    const [value, setValue] = useState(queryFromServer);

    useEffect(() => {
        setValue(queryFromServer);
    }, [queryFromServer]);

    useSearchShortcut(() => {
        inputRef.current?.focus();
    });

    const searchPath =
        listPage === 'handover'
            ? HANDOVER_SEARCH_PATH
            : REGISTER_SEARCH_PATH;

    const runSearch = (term: string) => {
        const status = page.props.filters?.status;

        router.get(
            searchPath,
            {
                q: term.trim() || undefined,
                status: status || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const handleChange = (next: string) => {
        setValue(next);

        if (!listPage) {
            return;
        }

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            runSearch(next);
        }, 350);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== 'Enter') {
            return;
        }

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if (listPage) {
            runSearch(value);
            return;
        }

        router.get(REGISTER_SEARCH_PATH, {
            q: value.trim() || undefined,
        });
    };

    const defaultPlaceholder = (() => {
        if (listPage === 'register') {
            return 'Search ref no., asset tag, user, department…';
        }

        if (listPage === 'handover') {
            return 'Search ref, user, department, old PC…';
        }

        return 'Search PCs — press Enter to open register';
    })();

    return (
        <div className={cn('relative w-full', className)}>
            <Search
                className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground/80"
                strokeWidth={1.75}
            />
            <Input
                ref={inputRef}
                data-header-search
                type="search"
                value={value}
                onChange={(event) => handleChange(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder ?? defaultPlaceholder}
                className="h-10 rounded-lg border-border/60 bg-background pr-[4.25rem] pl-10 text-sm shadow-sm transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-primary/30 focus-visible:ring-2 focus-visible:ring-primary/15"
            />
            <kbd className="pointer-events-none absolute top-1/2 right-2.5 hidden -translate-y-1/2 items-center gap-0.5 rounded border border-border/70 bg-muted/50 px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground shadow-sm sm:inline-flex">
                <span className="text-[10px]">Ctrl</span>
                <span>K</span>
            </kbd>
        </div>
    );
}
