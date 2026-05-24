import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { pageEnter } from '@/lib/motion';
import {
    RegisterForm,
    type RegisterFormOptions,
} from './register-form';

type PageProps = {
    options: RegisterFormOptions;
};

export default function PcRegisterCreate({ options }: PageProps) {
    return (
        <>
            <Head title="Add PC — Register" />
            <motion.div
                className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-4 md:p-6"
                variants={pageEnter}
                initial="hidden"
                animate="visible"
            >
                <RegisterForm
                    action="/pc-register"
                    method="post"
                    options={options}
                    submitLabel="Add to register"
                />

            </motion.div>
        </>
    );
}

PcRegisterCreate.layout = {
    title: 'Add',
};
