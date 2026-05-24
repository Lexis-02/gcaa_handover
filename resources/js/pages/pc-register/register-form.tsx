import { Form } from '@inertiajs/react';
import { FormInput } from '@/components/form-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export type RegisterFormOptions = {
    batches: { id: number; batch_code: string; year: number; total_pcs: number }[];
    departments: { id: number; name: string; code: string }[];
    buildings: { id: number; name: string }[];
    staff: {
        id: number;
        full_name: string;
        staff_number: string;
        department_id: number | null;
    }[];
    conditions: string[];
    os_options: string[];
};

export type RegisterFormData = {
    id?: number;
    ref_no?: string;
    batch_id?: number;
    asset_tag?: string | null;
    make_model?: string;
    serial_number?: string;
    hostname?: string | null;
    os?: string;
    condition_on_issue?: string;
    assigned_staff_id?: number | null;
    department_id?: number | null;
    building_id?: number | null;
    room_ext?: string | null;
};

const formLabelClassName =
    'text-sm font-medium text-foreground select-none';

const selectClassName = cn(
    'h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-sm',
    'text-slate-900 outline-none transition-all duration-300',
    'focus:border-accent/80 focus:bg-white focus:ring-4 focus:ring-accent/10',
    'dark:border-slate-800/80 dark:bg-slate-950/40 dark:text-slate-100',
    'dark:focus:border-accent/80 dark:focus:bg-slate-950/80',
);

type RegisterFormProps = {
    action: string;
    method?: 'post' | 'put';
    record?: RegisterFormData;
    options: RegisterFormOptions;
    submitLabel: string;
};

export function RegisterForm({
    action,
    method = 'post',
    record = {},
    options,
    submitLabel,
}: RegisterFormProps) {
    return (
        <Form
            action={action}
            method={method}
            className="space-y-8"
            options={{ preserveScroll: true }}
        >
            {({ processing, errors }) => (
                <>
                    {record.ref_no && (
                        <div className="rounded-lg border border-border/60 bg-muted/30 px-4 py-3">
                            <p className="text-xs font-medium text-muted-foreground">
                                Reference (auto)
                            </p>
                            <p className="font-mono text-sm font-semibold">
                                {record.ref_no}
                            </p>
                        </div>
                    )}

                    <section className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="batch_id" className={formLabelClassName}>
                                Batch
                            </Label>
                            <select
                                id="batch_id"
                                name="batch_id"
                                required
                                disabled={!!record.id}
                                defaultValue={record.batch_id ?? ''}
                                className={selectClassName}
                            >
                                <option value="" disabled>
                                    Select batch
                                </option>
                                {options.batches.map((b) => (
                                    <option key={b.id} value={b.id}>
                                        {b.batch_code} ({b.year}) — {b.total_pcs}{' '}
                                        PCs
                                    </option>
                                ))}
                            </select>
                            {errors.batch_id && (
                                <p className="text-sm text-destructive">
                                    {errors.batch_id}
                                </p>
                            )}
                        </div>

                        <FormInput
                            id="asset_tag"
                            label="Asset tag"
                            name="asset_tag"
                            defaultValue={record.asset_tag ?? ''}
                            error={errors.asset_tag}
                        />

                        <FormInput
                            id="make_model"
                            label="Make / model"
                            name="make_model"
                            required
                            defaultValue={record.make_model ?? ''}
                            error={errors.make_model}
                        />

                        <FormInput
                            id="serial_number"
                            label="Serial number"
                            name="serial_number"
                            required
                            defaultValue={record.serial_number ?? ''}
                            error={errors.serial_number}
                        />

                        <FormInput
                            id="hostname"
                            label="Hostname"
                            name="hostname"
                            defaultValue={record.hostname ?? ''}
                            error={errors.hostname}
                        />

                        <div className="space-y-2">
                            <Label htmlFor="os" className={formLabelClassName}>
                                Operating system
                            </Label>
                            <select
                                id="os"
                                name="os"
                                required
                                defaultValue={
                                    record.os ?? options.os_options[0]
                                }
                                className={selectClassName}
                            >
                                {options.os_options.map((os) => (
                                    <option key={os} value={os}>
                                        {os}
                                    </option>
                                ))}
                            </select>
                            {errors.os && (
                                <p className="text-sm text-destructive">
                                    {errors.os}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label
                                htmlFor="condition_on_issue"
                                className={formLabelClassName}
                            >
                                PC Condition
                            </Label>
                            <select
                                id="condition_on_issue"
                                name="condition_on_issue"
                                required
                                defaultValue={
                                    record.condition_on_issue ??
                                    options.conditions[0]
                                }
                                className={selectClassName}
                            >
                                {options.conditions.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                            {errors.condition_on_issue && (
                                <p className="text-sm text-destructive">
                                    {errors.condition_on_issue}
                                </p>
                            )}
                        </div>
                    </section>

                    <section className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2 md:col-span-2">
                            <Label
                                htmlFor="assigned_staff_id"
                                className={formLabelClassName}
                            >
                                End-user (staff)
                            </Label>
                            <select
                                id="assigned_staff_id"
                                name="assigned_staff_id"
                                defaultValue={
                                    record.assigned_staff_id ?? ''
                                }
                                className={selectClassName}
                            >
                                <option value="">Unassigned</option>
                                {options.staff.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.full_name} ({s.staff_number})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="department_id"
                                className={formLabelClassName}
                            >
                                Department
                            </Label>
                            <select
                                id="department_id"
                                name="department_id"
                                defaultValue={record.department_id ?? ''}
                                className={selectClassName}
                            >
                                <option value="">—</option>
                                {options.departments.map((d) => (
                                    <option key={d.id} value={d.id}>
                                        {d.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="building_id"
                                className={formLabelClassName}
                            >
                                Building
                            </Label>
                            <select
                                id="building_id"
                                name="building_id"
                                defaultValue={record.building_id ?? ''}
                                className={selectClassName}
                            >
                                <option value="">—</option>
                                {options.buildings.map((b) => (
                                    <option key={b.id} value={b.id}>
                                        {b.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <FormInput
                            id="room_ext"
                            label="Room / ext."
                            name="room_ext"
                            defaultValue={record.room_ext ?? ''}
                            error={errors.room_ext}
                        />
                    </section>

                    <div className="flex items-center gap-3 pt-2">
                        <Button type="submit" disabled={processing}>
                            {submitLabel}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.history.back()}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                    </div>
                </>
            )}
        </Form>
    );
}
