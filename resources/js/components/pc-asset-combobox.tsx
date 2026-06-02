import { User } from 'lucide-react';
import {
    SearchCombobox,
    type SearchComboboxOption,
} from '@/components/search-combobox';

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

function toOptions(pcs: PcAssetOption[]): SearchComboboxOption[] {
    return pcs.map((pc) => ({
        id: pc.id,
        primary: pc.ref_no,
        secondary: `Assigned to: ${pc.end_user ?? 'Unassigned'}`,
        leading: <User className="size-3.5 shrink-0 text-primary" aria-hidden />,
    }));
}

export function PcAssetCombobox({
    pcs,
    name = 'pc_asset_id',
    defaultValue,
    label = 'Associated New PC',
    error,
    required = true,
}: PcAssetComboboxProps) {
    const options = toOptions(pcs);

    return (
        <SearchCombobox
            options={options}
            name={name}
            label={label}
            placeholder="Type reference no or user name to search…"
            emptyMessage="No eligible PCs available."
            noMatchMessage="No match. Try another ref no or name."
            defaultValue={defaultValue}
            required={required}
            error={error}
            selectedHint={(option) => {
                const pc = pcs.find((item) => item.id === option.id);

                return (
                    <p className="text-xs text-muted-foreground">
                        Selected:{' '}
                        <span className="font-medium text-foreground">
                            {pc?.ref_no ?? option.primary}
                        </span>
                        {pc?.end_user ? ` · ${pc.end_user}` : ''}
                        {pc?.department ? ` · ${pc.department}` : ''}
                    </p>
                );
            }}
            filterOption={(option, term) => {
                const pc = pcs.find((item) => item.id === option.id);
                if (!pc) {
                    return false;
                }

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
            }}
        />
    );
}
