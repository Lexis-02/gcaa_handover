import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { pageEnter } from '@/lib/motion';

type LookupRecord = {
    id: number;
    label: string;
    sort_order: number;
    is_active: boolean;
};

export default function LookupValueShow({
    typeSlug,
    title,
    record,
}: {
    typeSlug: string;
    title: string;
    record: LookupRecord;
}) {
    const base = `/lookups/values/${typeSlug}`;

    return (
        <>
            <Head title={record.label} />
            <motion.div
                className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 p-4 md:p-6"
                variants={pageEnter}
                initial="hidden"
                animate="visible"
            >
                <dl className="space-y-4 rounded-xl border border-border/60 bg-card p-6">
                    <div>
                        <dt className="text-xs font-medium uppercase text-muted-foreground">Type</dt>
                        <dd className="mt-1">{title}</dd>
                    </div>
                    <div>
                        <dt className="text-xs font-medium uppercase text-muted-foreground">Label</dt>
                        <dd className="mt-1 font-medium">{record.label}</dd>
                    </div>
                    <div>
                        <dt className="text-xs font-medium uppercase text-muted-foreground">Sort order</dt>
                        <dd className="mt-1">{record.sort_order}</dd>
                    </div>
                    <div>
                        <dt className="text-xs font-medium uppercase text-muted-foreground">Status</dt>
                        <dd className="mt-1">{record.is_active ? 'Active' : 'Inactive'}</dd>
                    </div>
                </dl>
                <div className="flex gap-2">
                    <Button asChild variant="outline">
                        <Link href={`${base}/${record.id}/edit`}>
                            <Pencil className="size-4 mr-2" />
                            Edit
                        </Link>
                    </Button>
                    <Button asChild variant="ghost">
                        <Link href={base}>Back</Link>
                    </Button>
                </div>
            </motion.div>
        </>
    );
}

LookupValueShow.layout = { title: 'View lookup' };
