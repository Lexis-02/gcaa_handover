import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { LookupPageHeader } from '@/components/lookup-page-header';
import { ListRowActions } from '@/components/list-row-actions';
import { pageEnter } from '@/lib/motion';

type LookupRecord = {
    id: number;
    label: string;
    sort_order: number;
    is_active: boolean;
};

export default function LookupValuesIndex({
    typeSlug,
    title,
    records,
}: {
    type: string;
    typeSlug: string;
    title: string;
    records: LookupRecord[];
}) {
    const base = `/lookups/values/${typeSlug}`;

    return (
        <>
            <Head title={title} />
            <motion.div
                className="flex flex-1 flex-col gap-4 p-4 md:p-6"
                variants={pageEnter}
                initial="hidden"
                animate="visible"
            >
                <LookupPageHeader
                    addHref={`${base}/create`}
                    addLabel={`Add value`}
                />
                <div className="overflow-hidden">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-border/60 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                <th className="px-4 py-3">Label</th>
                                <th className="px-4 py-3">Order</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((row) => (
                                <tr
                                    key={row.id}
                                    className="border-b border-border/40 hover:bg-muted/20"
                                >
                                    <td className="px-4 py-3 font-medium">
                                        {row.label}
                                    </td>
                                    <td className="px-4 py-3">
                                        {row.sort_order}
                                    </td>
                                    <td className="px-4 py-3">
                                        {row.is_active ? 'Active' : 'Inactive'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <ListRowActions
                                            viewHref={`${base}/${row.id}`}
                                            editHref={`${base}/${row.id}/edit`}
                                            deleteUrl={`${base}/${row.id}`}
                                            itemLabel={row.label}
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

LookupValuesIndex.layout = {
    title: 'Lookup values',
};
