import { FormInput } from '@/components/form-input';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type Options = {
    roles: string[];
    role_labels?: Record<string, string>;
    departments: { id: number; name: string }[];
    staff: {
        id: number;
        full_name: string;
        staff_number: string;
        department_id: number;
    }[];
};

type UserRecord = {
    id?: number;
    name: string;
    username: string;
    role?: string | null;
    department_id?: number | null;
    staff_id?: number | null;
    is_active: boolean;
};

const selectClassName = cn(
    'h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-sm',
    'text-slate-900 outline-none transition-all duration-300',
    'focus:border-accent/80 focus:bg-white focus:ring-4 focus:ring-accent/10',
    'dark:border-slate-800/80 dark:bg-slate-950/40 dark:text-slate-100',
    'dark:focus:border-accent/80 dark:focus:bg-slate-950/80',
);

export function UserFormFields({
    record,
    options,
    isEdit,
    isSelf,
    processing,
    errors,
}: {
    record: UserRecord | null;
    options: Options;
    isEdit: boolean;
    isSelf?: boolean;
    processing: boolean;
    errors: Record<string, string>;
}) {
    return (
        <>
            <FormInput
                id="name"
                label="Full name"
                name="name"
                required
                defaultValue={record?.name ?? ''}
                error={errors.name}
            />
            <FormInput
                id="username"
                label="Username"
                name="username"
                required
                defaultValue={record?.username ?? ''}
                error={errors.username}
            />

            <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium">
                    Role
                </Label>
                <select
                    id="role"
                    name="role"
                    required
                    disabled={isSelf}
                    defaultValue={record?.role ?? ''}
                    className={selectClassName}
                >
                    <option value="">Select role</option>
                    {options.roles.map((role) => (
                        <option key={role} value={role}>
                            {options.role_labels?.[role] ??
                                role.replace(/_/g, ' ')}
                        </option>
                    ))}
                </select>
                {isSelf && (
                    <input
                        type="hidden"
                        name="role"
                        value={record?.role ?? ''}
                    />
                )}
                {errors.role && (
                    <p className="text-sm text-destructive">{errors.role}</p>
                )}
            </div>



            <FormInput
                id="password"
                label={
                    isEdit
                        ? 'New password (leave blank to keep)'
                        : 'Password'
                }
                name="password"
                type="password"
                required={!isEdit}
                error={errors.password}
            />
            <FormInput
                id="password_confirmation"
                label="Confirm password"
                name="password_confirmation"
                type="password"
                required={!isEdit}
                error={errors.password_confirmation}
            />

            {!isSelf && (
                <div className="flex items-center gap-2">
                    <input type="hidden" name="is_active" value="0" />
                    <input
                        id="is_active"
                        type="checkbox"
                        name="is_active"
                        value="1"
                        defaultChecked={record?.is_active ?? true}
                        className="size-4 rounded border-border"
                    />
                    <Label htmlFor="is_active" className="text-sm font-medium">
                        Account active
                    </Label>
                </div>
            )}

            <div className="flex items-center gap-3 pt-2">
                <Button type="submit" variant="success" disabled={processing}>
                    <Save className="size-4" />
                    {isEdit ? 'Save changes' : 'Create user'}
                </Button>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => window.history.back()}
                    disabled={processing}
                >
                    Cancel
                </Button>
            </div>
        </>
    );
}
