import { Form, Head } from '@inertiajs/react';
import { FormInput } from '@/components/form-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';
import { User, Lock } from 'lucide-react';

type Props = {
    passwordRules: string;
};

export default function Register({ passwordRules }: Props) {
    return (
        <>
            <Head title="Register" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <FormInput
                                id="name"
                                label="Name"
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
                                placeholder="Enter your username"
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

                            <Button
                                type="submit"
                                className="mt-4 w-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-gradient-to-r dark:from-[oklch(0.55_0.15_250)] dark:to-[oklch(0.40_0.12_250)] dark:hover:from-[oklch(0.60_0.16_250)] dark:hover:to-[oklch(0.45_0.13_250)] dark:text-white font-semibold text-sm hover:shadow-[0_0_15px_rgba(37,99,235,0.25)] transition-all duration-300 border-none h-11 cursor-pointer rounded-xl"
                                tabIndex={5}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner className="text-white dark:text-white mr-2" />}
                                Create account
                            </Button>
                        </div>

                        <div className="text-center text-xs text-slate-500 dark:text-slate-400 font-medium uppercase">
                            Already have credentials?{' '}
                            <TextLink href={login()} tabIndex={6} className="text-slate-700 dark:text-accent hover:underline dark:hover:underline">
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
    description: 'Create an account to manage and authorize GCAA IT asset handovers',
};
