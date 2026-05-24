import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { pageEnter } from '@/lib/motion';
import {
    RegisterForm,
    type RegisterFormData,
    type RegisterFormOptions,
} from './register-form';

type PageProps = {
    record: RegisterFormData;
    options: RegisterFormOptions;
};

export default function PcRegisterEdit({ record, options }: PageProps) {
    return (
        <>
            <Head title={`Edit ${record.ref_no}`} />
            <motion.div
                className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-4 md:p-6"
                variants={pageEnter}
                initial="hidden"
                animate="visible"
            >
                <RegisterForm
                    action={`/pc-register/${record.id}`}
                    method="put"
                    record={record}
                    options={options}
                    submitLabel="Save changes"
                />

            </motion.div>
        </>
    );
}

PcRegisterEdit.layout = {
    title: 'Edit',
};
