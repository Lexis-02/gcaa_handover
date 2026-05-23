import { Form, Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { FormInput } from '@/components/form-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { pageEnter } from '@/lib/motion';

type BuildingRecord = {
    id: number;
    name: string;
    region: string | null;
    is_active: boolean;
};

export default function BuildingForm({
    record,
}: {
    record: BuildingRecord | null;
}) {
    const isEdit = !!record?.id;

    return (
        <>
            <Head title={isEdit ? 'Edit building' : 'Add building'} />
            <motion.div
                className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 p-4 md:p-6"
                variants={pageEnter}
                initial="hidden"
                animate="visible"
            >
                <Form
                    action={
                        isEdit
                            ? `/lookups/buildings/${record.id}`
                            : '/lookups/buildings'
                    }
                    method={isEdit ? 'put' : 'post'}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <FormInput
                                id="name"
                                label="Building name"
                                name="name"
                                required
                                defaultValue={record?.name ?? ''}
                                error={errors.name}
                            />
                            <FormInput
                                id="region"
                                label="Region"
                                name="region"
                                defaultValue={record?.region ?? ''}
                                error={errors.region}
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
                            <Button type="submit" disabled={processing}>
                                {isEdit ? 'Save changes' : 'Add building'}
                            </Button>
                        </>
                    )}
                </Form>
                <Link
                    href="/lookups/buildings"
                    className="text-sm text-muted-foreground hover:text-foreground"
                >
                    ← Back to buildings
                </Link>
            </motion.div>
        </>
    );
}

BuildingForm.layout = { title: 'Building' };
