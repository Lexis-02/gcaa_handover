import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { pageEnter } from '@/lib/motion';

type Department = {
    id: number;
    name: string;
    code: string;
    is_active: boolean;
};

export default function DepartmentShow({ record }: { record: Department }) {
    return (
        <>
            <Head title={record.name} />
            <motion.div
                className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 p-4 md:p-6"
                variants={pageEnter}
                initial="hidden"
                animate="visible"
            >
                <dl className="space-y-4 rounded-xl border border-border/60 bg-card p-6">
                    <div>
                        <dt className="text-xs font-medium text-muted-foreground uppercase">
                            Name
                        </dt>
                        <dd className="mt-1 font-medium">{record.name}</dd>
                    </div>
                    <div>
                        <dt className="text-xs font-medium text-muted-foreground uppercase">
                            Code
                        </dt>
                        <dd className="mt-1 font-mono">{record.code}</dd>
                    </div>
                    <div>
                        <dt className="text-xs font-medium text-muted-foreground uppercase">
                            Status
                        </dt>
                        <dd className="mt-1">
                            {record.is_active ? 'Active' : 'Inactive'}
                        </dd>
                    </div>
                </dl>
                <div className="flex gap-2">
                    <Button asChild variant="outline">
                        <Link href={`/lookups/departments/${record.id}/edit`}>
                            Edit
                        </Link>
                    </Button>
                    <Button asChild variant="ghost">
                        <Link href="/lookups/departments">Back</Link>
                    </Button>
                </div>
            </motion.div>
        </>
    );
}

DepartmentShow.layout = { title: 'View department' };
