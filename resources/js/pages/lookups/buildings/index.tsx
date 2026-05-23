import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { LookupPageHeader } from '@/components/lookup-page-header';
import { ListRowActions } from '@/components/list-row-actions';
import { pageEnter } from '@/lib/motion';

type Building = {
    id: number;
    name: string;
    region: string | null;
    is_active: boolean;
};

export default function BuildingsIndex({ records }: { records: Building[] }) {
    return (
        <>
            <Head title="Buildings" />
            <motion.div
                className="flex flex-1 flex-col gap-4 p-4 md:p-6"
                variants={pageEnter}
                initial="hidden"
                animate="visible"
            >
                <LookupPageHeader
                    addHref="/lookups/buildings/create"
                    addLabel="Add building"
                />
                <div className="overflow-hidden">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-border/60 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Region</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((row) => (
                                <tr
                                    key={row.id}
                                    className="border-b border-border/40 hover:bg-muted/20"
                                >
                                    <td className="px-4 py-3 font-medium">
                                        {row.name}
                                    </td>
                                    <td className="px-4 py-3">
                                        {row.region ?? '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {row.is_active ? 'Active' : 'Inactive'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <ListRowActions
                                            viewHref={`/lookups/buildings/${row.id}`}
                                            editHref={`/lookups/buildings/${row.id}/edit`}
                                            deleteUrl={`/lookups/buildings/${row.id}`}
                                            itemLabel={row.name}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </>
    );
}

BuildingsIndex.layout = { title: 'Buildings' };
