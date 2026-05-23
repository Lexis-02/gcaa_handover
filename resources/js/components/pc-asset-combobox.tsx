import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { ChevronDown, Search, User } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export type PcAssetOption = {
    id: number;
    ref_no: string;
    serial_number: string;
    make_model: string;
    end_user: string | null;
    department: string | null;
};

type PcAssetComboboxProps = {
    pcs: PcAssetOption[];
    name?: string;
    defaultValue?: number;
    label?: string;
    error?: string;
    required?: boolean;
};

export function PcAssetCombobox({
    pcs,
    name = 'pc_asset_id',
    defaultValue,
    label = 'End user / new PC',
    error,
    required = true,
}: PcAssetComboboxProps) {
    const listId = useId();
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const initial = pcs.find((pc) => pc.id === defaultValue) ?? null;
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState(initial?.end_user ?? '');
    const [selected, setSelected] = useState<PcAssetOption | null>(initial);

    const filtered = useMemo(() => {
        const term = query.trim().toLowerCase();
        if (!term) {
            return pcs.slice(0, 8);
        }

        return pcs
            .filter((pc) => {
                const haystack = [
                    pc.end_user,
                    pc.ref_no,
                    pc.serial_number,
                    pc.make_model,
                    pc.department,
                ]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase();

                return haystack.includes(term);
            })
            .slice(0, 12);
    }, [pcs, query]);

    useEffect(() => {
        const onPointerDown = (event: MouseEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', onPointerDown);

        return () => document.removeEventListener('mousedown', onPointerDown);
    }, []);

    const pick = (pc: PcAssetOption) => {
        setSelected(pc);
        setQuery(pc.end_user ?? pc.ref_no);
        setOpen(false);
    };

    return (
        <div ref={containerRef} className="space-y-2">
            <Label htmlFor={listId} className="text-sm font-medium text-foreground">
                {label}
            </Label>
            <input type="hidden" name={name} value={selected?.id ?? ''} required={required} />
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
                    placeholder="Type end-user name to search…"
                    value={query}
                    onChange={(event) => {
                        setQuery(event.target.value);
                        setSelected(null);
                        setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                    className={cn(
                        'h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 pr-10 pl-10 text-sm',
                        'text-slate-900 outline-none transition-all duration-300',
                        'focus:border-accent/80 focus:bg-white focus:ring-4 focus:ring-accent/10',
                        'dark:border-slate-800/80 dark:bg-slate-950/40 dark:text-slate-100',
                    )}
                />
                <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
                {open && (
                    <ul
                        id={`${listId}-listbox`}
                        role="listbox"
                        className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-border bg-card py-1 shadow-lg"
                    >
                        {filtered.length === 0 ? (
                            <li className="px-3 py-2.5 text-sm text-muted-foreground">
                                {pcs.length === 0
                                    ? 'No PCs available — assign an end user in the register first.'
                                    : 'No match. Try another name or ref no.'}
                            </li>
                        ) : (
                            filtered.map((pc) => (
                                <li key={pc.id} role="option">
                                    <button
                                        type="button"
                                        className={cn(
                                            'flex w-full flex-col gap-0.5 px-3 py-2.5 text-left text-sm hover:bg-muted/60',
                                            selected?.id === pc.id && 'bg-primary/5',
                                        )}
                                        onMouseDown={(event) => event.preventDefault()}
                                        onClick={() => pick(pc)}
                                    >
                                        <span className="flex items-center gap-2 font-medium">
                                            <User className="size-3.5 shrink-0 text-primary" />
                                            {pc.end_user ?? 'Unassigned'}
                                        </span>
                                        <span className="font-mono text-xs text-muted-foreground">
                                            {pc.ref_no}
                                        </span>
                                    </button>
                                </li>
                            ))
                        )}
                    </ul>
                )}
            </div>
            {selected && (
                <p className="text-xs text-muted-foreground">
                    Selected:{' '}
                    <span className="font-medium text-foreground">
                        {selected.ref_no}
                    </span>
                    {selected.department ? ` · ${selected.department}` : ''}
                </p>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}
