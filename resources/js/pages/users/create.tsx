import { Form, Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { UserFormFields } from '@/pages/users/user-form';
import { pageEnter } from '@/lib/motion';

export default function UsersCreate({
    options,
}: {
    options: Parameters<typeof UserFormFields>[0]['options'];
}) {
    return (
        <>
            <Head title="Add user" />
            <motion.div
                className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 p-4 md:p-6"
                variants={pageEnter}
                initial="hidden"
                animate="visible"
            >
                <Form action="/users" method="post" className="space-y-6">
                    {({ processing, errors }) => (
                        <UserFormFields
                            record={null}
                            options={options}
                            isEdit={false}
                            processing={processing}
                            errors={errors}
                        />
                    )}
                </Form>
                <Link
                    href="/users"
                    className="text-sm text-muted-foreground hover:text-foreground"
                >
                    ← Back to users
                </Link>
            </motion.div>
        </>
    );
}

UsersCreate.layout = { title: 'Add user' };
