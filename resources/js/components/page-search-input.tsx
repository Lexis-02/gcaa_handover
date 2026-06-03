import { router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';

type PageSearchInputProps = {
    value?: string;
    routePath: string;
    placeholder?: string;
    preserveScroll?: boolean;
    className?: string;
};

export function PageSearchInput({
    value = '',
    routePath,
    placeholder = 'Search...',
    preserveScroll = true,
    className = 'w-full max-w-sm',
}: PageSearchInputProps) {
    const [query, setQuery] = useState(value);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        setQuery(value);
    }, [value]);

    const runSearch = (term: string) => {
        const urlParams = new URLSearchParams(window.location.search);

        if (term.trim()) {
            urlParams.set('q', term.trim());
        } else {
            urlParams.delete('q');
        }

        // Must explicitly delete page param when searching to go back to page 1
        urlParams.delete('page');

        router.get(`${routePath}?${urlParams.toString()}`, undefined, {
            preserveState: true,
            preserveScroll,
            replace: true,
        });
    };

    const handleChange = (val: string) => {
        setQuery(val);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            runSearch(val);
        }, 350);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
            runSearch(query);
        }
    };

    return (
        <div className={`relative ${className}`}>
            <Search
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground/80"
                strokeWidth={1.75}
            />
            <Input
                type="search"
                value={query}
                onChange={(e) => handleChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="h-9 rounded-lg bg-background pr-4 pl-9 shadow-sm placeholder:text-muted-foreground/70 md:h-10"
            />
        </div>
    );
}
