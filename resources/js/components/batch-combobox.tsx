import { Package } from 'lucide-react';
import {
    SearchCombobox,
    type SearchComboboxOption,
} from '@/components/search-combobox';

export type BatchOption = {
    id: number;
    batch_code: string;
    year: number;
    total_pcs: number;
};

type BatchComboboxProps = {
    batches: BatchOption[];
    name?: string;
    defaultValue?: number;
    label?: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;
};

function toOptions(batches: BatchOption[]): SearchComboboxOption[] {
    return batches.map((batch) => ({
        id: batch.id,
        primary: batch.batch_code,
        secondary: `${batch.year} · ${batch.total_pcs} PCs`,
        leading: (
            <Package className="size-3.5 shrink-0 text-primary" aria-hidden />
        ),
    }));
}

export function BatchCombobox({
    batches,
    name = 'batch_id',
    defaultValue,
    label = 'Batch',
    error,
    disabled = false,
    required = true,
}: BatchComboboxProps) {
    const options = toOptions(batches);

    return (
        <SearchCombobox
            options={options}
            name={name}
            label={label}
            placeholder="Type batch code or year to search…"
            emptyMessage="No batches available."
            noMatchMessage="No match. Try another batch code or year."
            defaultValue={defaultValue}
            required={required}
            disabled={disabled}
            error={error}
            selectedHint={(option) => (
                <p className="text-xs text-muted-foreground">
                    Selected:{' '}
                    <span className="font-medium text-foreground">
                        {option.primary}
                    </span>
                    {option.secondary ? ` · ${option.secondary}` : ''}
                </p>
            )}
            filterOption={(option, term) => {
                const batch = batches.find((b) => b.id === option.id);
                if (!batch) {
                    return false;
                }

                const haystack = [
                    batch.batch_code,
                    String(batch.year),
                    String(batch.total_pcs),
                ]
                    .join(' ')
                    .toLowerCase();

                return haystack.includes(term);
            }}
        />
    );
}
