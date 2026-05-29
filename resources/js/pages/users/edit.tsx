import { Form, Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Pencil } from 'lucide-react';
import { UserFormFields } from '@/pages/users/user-form';
import { pageEnter } from '@/lib/motion';

export default function UsersEdit({
    record,
    options,
    meta,
}: {
    record: Parameters<typeof UserFormFields>[0]['record'] & { id: number };
    options: Parameters<typeof UserFormFields>[0]['options'];
    meta: { is_self: boolean };
}) {
    return (
        <>
            <Head title={`Edit ${record?.name}`} />
            <motion.div
                className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 p-4 md:p-6"
                variants={pageEnter}
                initial="hidden"
                animate="visible"
            >
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Pencil className="size-5" />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold">Edit user</h1>
                        <p className="text-sm text-muted-foreground">
                            {record.name}
                        </p>
                    </div>
                </div>

                {meta.is_self && (
                    <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-900 dark:text-amber-200">
                        You are editing your own account. Role and active status
                        cannot be changed here.
                    </p>
                )}

                <section className="mt-4">
                    <Form
                        action={`/users/${record.id}`}
                        method="put"
                        className="space-y-6"
                    >
                        {({ processing, errors }) => (
                            <UserFormFields
                                record={record}
                                options={options}
                                isEdit
                                isSelf={meta.is_self}
                                processing={processing}
                                errors={errors}
                            />
                        )}
                    </Form>
                </section>
            </motion.div>
        </>
    );
}

UsersEdit.layout = { title: 'Edit user' };
