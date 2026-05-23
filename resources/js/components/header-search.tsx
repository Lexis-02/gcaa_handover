import { Search } from 'lucide-react';
import { useRef } from 'react';
import { Input } from '@/components/ui/input';
import { useSearchShortcut } from '@/hooks/use-search-shortcut';
import { cn } from '@/lib/utils';

type HeaderSearchProps = {
    className?: string;
    placeholder?: string;
};

export function HeaderSearch({
    className,
    placeholder = 'Search PCs, batches, users…',
}: HeaderSearchProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    useSearchShortcut(() => {
        inputRef.current?.focus();
    });

    return (
        <div className={cn('relative w-full max-w-md', className)}>
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                ref={inputRef}
                data-header-search
                type="search"
                placeholder={placeholder}
                className="h-10 rounded-xl border-border/70 bg-muted/40 pr-20 pl-10 text-sm shadow-none focus-visible:border-primary/40 focus-visible:ring-primary/20"
            />
            <kbd className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 items-center gap-0.5 rounded-md border border-border/80 bg-background px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground sm:inline-flex">
                <span className="text-xs">Ctrl</span>K
            </kbd>
        </div>
    );
}
