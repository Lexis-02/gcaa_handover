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
        <div className={cn('relative w-full', className)}>
            <Search
                className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground/80"
                strokeWidth={1.75}
            />
            <Input
                ref={inputRef}
                data-header-search
                type="search"
                placeholder={placeholder}
                className="h-10 rounded-lg border-border/60 bg-background pr-[4.25rem] pl-10 text-sm shadow-sm transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-primary/30 focus-visible:ring-2 focus-visible:ring-primary/15"
            />
            <kbd className="pointer-events-none absolute top-1/2 right-2.5 hidden -translate-y-1/2 items-center gap-0.5 rounded border border-border/70 bg-muted/50 px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground shadow-sm sm:inline-flex">
                <span className="text-[10px]">Ctrl</span>
                <span>K</span>
            </kbd>
        </div>
    );
}
