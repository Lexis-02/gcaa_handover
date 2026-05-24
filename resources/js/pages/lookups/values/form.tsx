import { Form, Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { FormInput } from '@/components/form-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { pageEnter } from '@/lib/motion';

type LookupRecord = {
    id: number;
    label: string;
    sort_order: number;
    is_active: boolean;
};

export default function LookupValueForm({
    typeSlug,
    title,
    record,
}: {
    type: string;
    typeSlug: string;
    title: string;
    record: LookupRecord | null;
}) {
    const isEdit = !!record?.id;
    const base = `/lookups/values/${typeSlug}`;

    return (
        <>
            <Head title={isEdit ? `Edit — ${title}` : `Add — ${title}`} />
            <motion.div
                className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 p-4 md:p-6"
                variants={pageEnter}
                initial="hidden"
                animate="visible"
            >
                <Form
                    action={isEdit ? `${base}/${record.id}` : base}
                    method={isEdit ? 'put' : 'post'}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <FormInput
                                id="label"
                                label="Label"
                                name="label"
                                required
                                defaultValue={record?.label ?? ''}
                                error={errors.label}
                            />
                            <FormInput
                                id="sort_order"
                                label="Sort order"
                                name="sort_order"
                                type="number"
                                min={0}
                                defaultValue={String(record?.sort_order ?? 0)}
                                error={errors.sort_order}
                            />
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
                                <Label htmlFor="is_active" className="text-sm font-medium text-foreground">
                                    Active
                                </Label>
                            </div>
                            <div className="flex items-center gap-3 pt-2">
                                <Button type="submit" disabled={processing}>
                                    {isEdit ? 'Save changes' : 'Add value'}
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href={base}>Cancel</Link>
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </motion.div>
        </>
    );
}

LookupValueForm.layout = { title: 'Lookup value' };
