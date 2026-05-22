import { Form, Head, usePage } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import { FormInput } from '@/components/form-input';
import { Button } from '@/components/ui/button';
import { edit } from '@/routes/profile';
import type { Auth } from '@/types';
import { User } from 'lucide-react';

type PageProps = {
    auth: Auth;
};

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Profile settings" />

            <h1 className="sr-only">Profile settings</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Profile"
                    description="Update your name and username"
                />

                <Form
                    {...ProfileController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <FormInput
                                id="name"
                                label="Name"
                                type="text"
                                name="name"
                                required
                                autoComplete="name"
                                placeholder="Full name"
                                defaultValue={auth.user.name}
                                icon={User}
                                error={errors.name}
                            />

                            <FormInput
                                id="username"
                                label="Username"
                                type="text"
                                name="username"
                                required
                                autoComplete="username"
                                placeholder="Username"
                                defaultValue={auth.user.username}
                                icon={User}
                                error={errors.username}
                            />

                            <div className="flex items-center gap-4">
                                <Button
                                    disabled={processing}
                                    data-test="update-profile-button"
                                >
                                    Save
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>

            <DeleteUser />
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Profile settings',
            href: edit(),
        },
    ],
};
