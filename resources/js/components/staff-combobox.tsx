import { User } from 'lucide-react';
import {
    SearchCombobox,
    type SearchComboboxOption,
} from '@/components/search-combobox';

export type StaffOption = {
    id: number;
    full_name: string;
    staff_number: string;
    department_id: number | null;
    department_name?: string | null;
};

type StaffComboboxProps = {
    staff: StaffOption[];
    name?: string;
    defaultValue?: number | null;
    label?: string;
    error?: string;
    required?: boolean;
};

function toOptions(staff: StaffOption[]): SearchComboboxOption[] {
    return staff.map((member) => ({
        id: member.id,
        primary: member.full_name,
        secondary: [member.staff_number, member.department_name]
            .filter(Boolean)
            .join(' · '),
        leading: (
            <User className="size-3.5 shrink-0 text-primary" aria-hidden />
        ),
    }));
}

export function StaffCombobox({
    staff,
    name = 'assigned_staff_id',
    defaultValue,
    label = 'End-user (staff)',
    error,
    required = false,
}: StaffComboboxProps) {
    const options = toOptions(staff);

    return (
        <SearchCombobox
            options={options}
            name={name}
            label={label}
            placeholder="Type end-user name to search…"
            emptyMessage="No staff available."
            noMatchMessage="No match. Try another name or staff number."
            defaultValue={defaultValue ?? undefined}
            required={required}
            allowEmpty
            emptyLabel="Unassigned"
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
                const member = staff.find((s) => s.id === option.id);
                if (!member) {
                    return false;
                }

                const haystack = [
                    member.full_name,
                    member.staff_number,
                    member.department_name,
                ]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase();

                return haystack.includes(term);
            }}
        />
    );
}
