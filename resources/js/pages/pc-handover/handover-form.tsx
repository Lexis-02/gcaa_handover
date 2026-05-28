import { Form } from '@inertiajs/react';
import { FormInput } from '@/components/form-input';
import {
    PcAssetCombobox,
    type PcAssetOption,
} from '@/components/pc-asset-combobox';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export type HandoverFormOptions = {
    pcs?: PcAssetOption[];
    old_pc_conditions: string[];
    yes_no_options: string[];
};

export type HandoverFormData = {
    pc_asset_id?: number;
    ref_no?: string;
    end_user_name?: string | null;
    department_name?: string | null;
    old_asset_tag?: string | null;
    old_make_model?: string;
    old_serial_no?: string;
    year_of_purchase?: number | null;
    condition?: string;
    reason_for_replacement?: string | null;
    data_wiped?: string;
    returned_to_stores?: string;
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

type HandoverFormProps = {
    action: string;
    method?: 'post' | 'put';
    record?: HandoverFormData;
    options: HandoverFormOptions;
    submitLabel: string;
    showPcSelect?: boolean;
};

export function HandoverForm({
    action,
    method = 'post',
    record = {},
    options,
    submitLabel,
    showPcSelect = false,
}: HandoverFormProps) {
    return (
        <Form
            action={action}
            method={method}
            className="space-y-8"
            options={{ preserveScroll: true }}
        >
            {({ processing, errors }) => (
                <>
                    {showPcSelect && options.pcs && (
                        <PcAssetCombobox
                            pcs={options.pcs}
                            defaultValue={record.pc_asset_id}
                            error={errors.pc_asset_id}
                        />
                    )}

                    {!showPcSelect && record.ref_no && (
                        <div className="rounded-lg border border-border/60 bg-muted/30 px-4 py-3">
                            <p className="text-xs font-medium text-muted-foreground">
                                New PC
                            </p>
                            <p className="font-mono text-sm font-semibold">
                                {record.ref_no}
                            </p>
                            {record.end_user_name && (
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {record.end_user_name}
                                    {record.department_name
                                        ? ` · ${record.department_name}`
                                        : ''}
                                </p>
                            )}
                        </div>
                    )}

                    <div className="space-y-4">
                        <h2 className="text-sm font-semibold tracking-tight">
                            Old PC details
                        </h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <FormInput
                                label="Old asset tag"
                                name="old_asset_tag"
                                defaultValue={record.old_asset_tag ?? ''}
                                error={errors.old_asset_tag}
                            />
                            <FormInput
                                label="Year of purchase"
                                name="year_of_purchase"
                                type="number"
                                min={1990}
                                max={new Date().getFullYear() + 1}
                                defaultValue={
                                    record.year_of_purchase?.toString() ?? ''
                                }
                                error={errors.year_of_purchase}
                            />
                        </div>
                        <FormInput
                            label="Old make / model"
                            name="old_make_model"
                            defaultValue={record.old_make_model ?? ''}
                            error={errors.old_make_model}
                            required
                        />
                        <FormInput
                            label="Old serial no."
                            name="old_serial_no"
                            defaultValue={record.old_serial_no ?? ''}
                            error={errors.old_serial_no}
                            required
                        />
                        <div className="space-y-2">
                            <Label className={formLabelClassName}>
                                Old PC condition
                            </Label>
                            <select
                                name="condition"
                                defaultValue={record.condition ?? ''}
                                required
                                className={selectClassName}
                            >
                                <option value="" disabled>
                                    Select condition…
                                </option>
                                {options.old_pc_conditions.map((value) => (
                                    <option key={value} value={value}>
                                        {value}
                                    </option>
                                ))}
                            </select>
                            {errors.condition && (
                                <p className="text-sm text-destructive">
                                    {errors.condition}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label className={formLabelClassName}>
                                Reason for replacement
                            </Label>
                            <textarea
                                name="reason_for_replacement"
                                rows={3}
                                defaultValue={
                                    record.reason_for_replacement ?? ''
                                }
                                className={cn(
                                    selectClassName,
                                    'h-auto min-h-[5.5rem] resize-y py-2.5',
                                )}
                            />
                            {errors.reason_for_replacement && (
                                <p className="text-sm text-destructive">
                                    {errors.reason_for_replacement}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label className={formLabelClassName}>
                                    Data wiped?
                                </Label>
                                <select
                                    name="data_wiped"
                                    defaultValue={record.data_wiped ?? ''}
                                    required
                                    className={selectClassName}
                                >
                                    <option value="" disabled>
                                        Select…
                                    </option>
                                    {options.yes_no_options.map((value) => (
                                        <option key={value} value={value}>
                                            {value}
                                        </option>
                                    ))}
                                </select>
                                {errors.data_wiped && (
                                    <p className="text-sm text-destructive">
                                        {errors.data_wiped}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label className={formLabelClassName}>
                                    Returned to stores?
                                </Label>
                                <select
                                    name="returned_to_stores"
                                    defaultValue={
                                        record.returned_to_stores ?? ''
                                    }
                                    required
                                    className={selectClassName}
                                >
                                    <option value="" disabled>
                                        Select…
                                    </option>
                                    {options.yes_no_options.map((value) => (
                                        <option key={value} value={value}>
                                            {value}
                                        </option>
                                    ))}
                                </select>
                                {errors.returned_to_stores && (
                                    <p className="text-sm text-destructive">
                                        {errors.returned_to_stores}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button type="submit" disabled={processing}>
                            <Save className="size-4" />
                            {submitLabel}
                        </Button>
                    </div>
                </>
            )}
        </Form>
    );
}
