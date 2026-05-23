import { Form, Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';
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
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <UserPlus className="size-5" />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold">Add user</h1>
                        <p className="text-sm text-muted-foreground">
                            Create an account directly (admin setup).
                        </p>
                    </div>
                </div>

                <p className="text-sm text-muted-foreground">
                    Prefer self-registration?{' '}
                    <Link
                        href="/users/invitations"
                        className="font-medium text-primary hover:underline"
                    >
                        Generate a registration link
                    </Link>{' '}
                    instead.
                </p>

                <section className="mt-4">
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
                </section>

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
