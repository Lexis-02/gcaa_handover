import { Form, Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { FormInput } from '@/components/form-input';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { pageEnter } from '@/lib/motion';

type DepartmentRecord = {
    id: number;
    name: string;
    code: string;
    is_active: boolean;
};

export default function DepartmentForm({
    record,
}: {
    record: DepartmentRecord | null;
}) {
    const isEdit = !!record?.id;

    return (
        <>
            <Head title={isEdit ? 'Edit department' : 'Add department'} />
            <motion.div
                className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 p-4 md:p-6"
                variants={pageEnter}
                initial="hidden"
                animate="visible"
            >
                <Form
                    action={
                        isEdit
                            ? `/lookups/departments/${record.id}`
                            : '/lookups/departments'
                    }
                    method={isEdit ? 'put' : 'post'}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <FormInput
                                id="name"
                                label="Department name"
                                name="name"
                                required
                                defaultValue={record?.name ?? ''}
                                error={errors.name}
                            />
                            <FormInput
                                id="code"
                                label="Code"
                                name="code"
                                required
                                defaultValue={record?.code ?? ''}
                                error={errors.code}
                            />
                            <div className="flex items-center gap-2">
                                <input
                                    type="hidden"
                                    name="is_active"
                                    value="0"
                                />
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
                                    <Save className="size-4" />
                                    {isEdit ? 'Save changes' : 'Add department'}
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href="/lookups/departments">Cancel</Link>
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </motion.div>
        </>
    );
}

DepartmentForm.layout = {
    title: 'Department',
};
