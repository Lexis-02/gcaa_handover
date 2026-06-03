import {
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export type SearchComboboxOption = {
    id: number | string;
    primary: string;
    secondary?: string | null;
    leading?: ReactNode;
};

type SearchComboboxProps = {
    options: SearchComboboxOption[];
    name: string;
    label: string;
    placeholder: string;
    emptyMessage: string;
    noMatchMessage: string;
    defaultValue?: number | string;
    defaultQuery?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    allowEmpty?: boolean;
    emptyLabel?: string;
    selectedHint?: (option: SearchComboboxOption) => ReactNode;
    filterOption?: (option: SearchComboboxOption, term: string) => boolean;
};

export function SearchCombobox({
    options,
    name,
    label,
    placeholder,
    emptyMessage,
    noMatchMessage,
    defaultValue,
    defaultQuery = '',
    required = false,
    disabled = false,
    error,
    allowEmpty = false,
    emptyLabel = 'Unassigned',
    selectedHint,
    filterOption,
}: SearchComboboxProps) {
    const listId = useId();
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const initial =
        options.find(
            (option) => String(option.id) === String(defaultValue ?? ''),
        ) ?? null;
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState(
        defaultQuery || initial?.primary || (allowEmpty ? '' : ''),
    );
    const [selected, setSelected] = useState<SearchComboboxOption | null>(
        initial,
    );

    const filtered = useMemo(() => {
        const term = query.trim().toLowerCase();
        const list = term
            ? options.filter((option) =>
                  filterOption
                      ? filterOption(option, term)
                      : [option.primary, option.secondary]
                            .filter(Boolean)
                            .join(' ')
                            .toLowerCase()
                            .includes(term),
              )
            : options;

        return list.slice(0, 12);
    }, [options, query, filterOption]);

    useEffect(() => {
        const onPointerDown = (event: MouseEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', onPointerDown);

        return () => document.removeEventListener('mousedown', onPointerDown);
    }, []);

    const pick = (option: SearchComboboxOption | null) => {
        setSelected(option);
        setQuery(option?.primary ?? '');
        setOpen(false);
    };

    const hiddenValue = selected?.id ?? '';

    return (
        <div ref={containerRef} className="space-y-2">
            <Label
                htmlFor={listId}
                className="text-sm font-medium text-foreground"
            >
                {label}
            </Label>
            <input
                type="hidden"
                name={name}
                value={hiddenValue}
                required={required && !allowEmpty}
                disabled={disabled}
            />
            <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                    ref={inputRef}
                    id={listId}
                    type="text"
                    autoComplete="off"
                    role="combobox"
                    aria-expanded={open}
                    aria-controls={`${listId}-listbox`}
                    placeholder={placeholder}
                    value={query}
                    disabled={disabled}
                    onChange={(event) => {
                        setQuery(event.target.value);
                        setSelected(null);
                        setOpen(true);
                    }}
                    onFocus={() => !disabled && setOpen(true)}
                    className={cn(
                        'h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 pr-10 pl-10 text-sm',
                        'text-slate-900 transition-all duration-300 outline-none',
                        'focus:border-accent/80 focus:bg-white focus:ring-4 focus:ring-accent/10',
                        'dark:border-slate-800/80 dark:bg-slate-950/40 dark:text-slate-100',
                        'dark:focus:border-accent/80 dark:focus:bg-slate-950/80',
                        disabled && 'cursor-not-allowed opacity-60',
                    )}
                />
                <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
                {open && !disabled && (
                    <ul
                        id={`${listId}-listbox`}
                        role="listbox"
                        className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-border bg-card py-1 shadow-lg"
                    >
                        {allowEmpty && (
                            <li role="option">
                                <button
                                    type="button"
                                    className={cn(
                                        'flex w-full px-3 py-2.5 text-left text-sm text-muted-foreground hover:bg-muted/60',
                                        !selected && 'bg-primary/5',
                                    )}
                                    onMouseDown={(event) =>
                                        event.preventDefault()
                                    }
                                    onClick={() => pick(null)}
                                >
                                    {emptyLabel}
                                </button>
                            </li>
                        )}
                        {filtered.length === 0 ? (
                            <li className="px-3 py-2.5 text-sm text-muted-foreground">
                                {options.length === 0
                                    ? emptyMessage
                                    : noMatchMessage}
                            </li>
                        ) : (
                            filtered.map((option) => (
                                <li key={option.id} role="option">
                                    <button
                                        type="button"
                                        className={cn(
                                            'flex w-full flex-col gap-0.5 px-3 py-2.5 text-left text-sm hover:bg-muted/60',
                                            selected?.id === option.id &&
                                                'bg-primary/5',
                                        )}
                                        onMouseDown={(event) =>
                                            event.preventDefault()
                                        }
                                        onClick={() => pick(option)}
                                    >
                                        <span className="flex items-center gap-2 font-medium">
                                            {option.leading}
                                            {option.primary}
                                        </span>
                                        {option.secondary && (
                                            <span className="font-mono text-xs text-muted-foreground">
                                                {option.secondary}
                                            </span>
                                        )}
                                    </button>
                                </li>
                            ))
                        )}
                    </ul>
                )}
            </div>
            {selected && selectedHint?.(selected)}
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}
