import { Form, Head } from '@inertiajs/react';
import { FormInput } from '@/components/form-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { Lock, Shield, User } from 'lucide-react';

type InvitationInfo = {
    role: string;
    role_label: string;
    department: { id: number; name: string } | null;
    expires_at: string;
};

type Props = {
    passwordRules: string;
    registerUrl: string;
    invitation: InvitationInfo | null;
};

export default function Register({
    passwordRules,
    registerUrl,
    invitation,
}: Props) {
    return (
        <>
            <Head title="Register" />
            {invitation && (
                <div className="mb-6 rounded-xl border border-primary/25 bg-primary/5 px-4 py-3 text-sm">
                    <div className="flex items-start gap-3">
                        <Shield className="mt-0.5 size-5 shrink-0 text-primary" />
                        <div>
                            <p className="font-semibold text-foreground">
                                Invitation to register
                            </p>
                            <p className="mt-1 text-muted-foreground">
                                You will be registered as{' '}
                                <span className="font-medium text-foreground">
                                    {invitation.role_label}
                                </span>
                                {invitation.department && (
                                    <>
                                        {' '}
                                        ({invitation.department.name})
                                    </>
                                )}
                                . Link valid until {invitation.expires_at}.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <Form
                action={registerUrl}
                method="post"
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <FormInput
                                id="name"
                                label="Full name"
                                type="text"
                                name="name"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="name"
                                placeholder="Full name"
                                icon={User}
                                error={errors.name}
                            />

                            <FormInput
                                id="username"
                                label="Username"
                                type="text"
                                name="username"
                                required
                                tabIndex={2}
                                autoComplete="username"
                                placeholder="Choose a username"
                                icon={User}
                                error={errors.username}
                            />

                            <FormInput
                                id="password"
                                label="Password"
                                type="password"
                                name="password"
                                required
                                tabIndex={3}
                                autoComplete="new-password"
                                placeholder="Password"
                                icon={Lock}
                                error={errors.password}
                            />

                            <FormInput
                                id="password_confirmation"
                                label="Confirm password"
                                type="password"
                                name="password_confirmation"
                                required
                                tabIndex={4}
                                autoComplete="new-password"
                                placeholder="Confirm password"
                                icon={Lock}
                                error={errors.password_confirmation}
                            />

                            <p className="text-xs text-muted-foreground">
                                {passwordRules}
                            </p>

                            <Button
                                type="submit"
                                className="mt-2 w-full"
                                tabIndex={5}
                                data-test="register-user-button"
                            >
                                {processing && (
                                    <Spinner className="mr-2 size-4" />
                                )}
                                Create account
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <TextLink
                                href={login()}
                                tabIndex={6}
                                className="font-medium text-primary hover:underline"
                            >
                                Log in
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: 'Register ICT Account',
    description:
        'Create your GCAA PC Handover account using your invitation link',
};
