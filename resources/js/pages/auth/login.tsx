import { Form, Head } from '@inertiajs/react';
import { FormInput } from '@/components/form-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';
import { User, Lock } from 'lucide-react';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Log in" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <FormInput
                                id="username"
                                label="Username"
                                type="text"
                                name="username"
                                required
                                autoFocus
                                tabIndex={1}
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
                                tabIndex={2}
                                autoComplete="current-password"
                                placeholder="Password"
                                icon={Lock}
                                error={errors.password}
                            />

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="border-slate-300 data-[state=checked]:bg-slate-900 data-[state=checked]:text-white dark:border-slate-800 dark:data-[state=checked]:bg-accent dark:data-[state=checked]:text-white"
                                />
                                <Label
                                    htmlFor="remember"
                                    className="cursor-pointer text-xs font-medium tracking-wider text-slate-500 uppercase select-none dark:text-slate-400"
                                >
                                    Remember me
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-4 h-11 w-full cursor-pointer rounded-xl border-none bg-slate-900 text-sm font-semibold text-white transition-all duration-300 hover:bg-slate-800 hover:shadow-[0_0_15px_rgba(37,99,235,0.25)] dark:bg-gradient-to-r dark:from-[oklch(0.55_0.15_250)] dark:to-[oklch(0.40_0.12_250)] dark:text-white dark:hover:from-[oklch(0.60_0.16_250)] dark:hover:to-[oklch(0.45_0.13_250)]"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && (
                                    <Spinner className="mr-2 text-white dark:text-white" />
                                )}
                                Log in
                            </Button>
                        </div>
                    </>
                )}
            </Form>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Log in to Handover System',
    description: 'Manage GCAA IT asset handovers',
};
