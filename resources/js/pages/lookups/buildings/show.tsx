import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { pageEnter } from '@/lib/motion';

type Building = {
    id: number;
    name: string;
    region: string | null;
    is_active: boolean;
};

export default function BuildingShow({ record }: { record: Building }) {
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
                        <dt className="text-xs font-medium uppercase text-muted-foreground">Name</dt>
                        <dd className="mt-1 font-medium">{record.name}</dd>
                    </div>
                    <div>
                        <dt className="text-xs font-medium uppercase text-muted-foreground">Region</dt>
                        <dd className="mt-1">{record.region ?? '—'}</dd>
                    </div>
                    <div>
                        <dt className="text-xs font-medium uppercase text-muted-foreground">Status</dt>
                        <dd className="mt-1">{record.is_active ? 'Active' : 'Inactive'}</dd>
                    </div>
                </dl>
                <div className="flex gap-2">
                    <Button asChild variant="outline">
                        <Link href={`/lookups/buildings/${record.id}/edit`}>Edit</Link>
                    </Button>
                    <Button asChild variant="ghost">
                        <Link href="/lookups/buildings">Back</Link>
                    </Button>
                </div>
            </motion.div>
        </>
    );
}

BuildingShow.layout = { title: 'View building' };
