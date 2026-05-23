import { Form, Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
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
                {meta.is_self && (
                    <p className="text-sm text-muted-foreground">
                        You are editing your own account. Role and active status
                        cannot be changed here.
                    </p>
                )}

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
                <Link
                    href={`/users/${record.id}`}
                    className="text-sm text-muted-foreground hover:text-foreground"
                >
                    ← Back to user
                </Link>
            </motion.div>
        </>
    );
}

UsersEdit.layout = { title: 'Edit user' };
