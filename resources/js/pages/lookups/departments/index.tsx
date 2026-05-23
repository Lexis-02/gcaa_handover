import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { LookupPageHeader } from '@/components/lookup-page-header';
import { ListRowActions } from '@/components/list-row-actions';
import { pageEnter } from '@/lib/motion';

type Department = {
    id: number;
    name: string;
    code: string;
    is_active: boolean;
};

export default function DepartmentsIndex({
    records,
}: {
    records: Department[];
}) {
    return (
        <>
            <Head title="Departments" />
            <motion.div
                className="flex flex-1 flex-col gap-4 p-4 md:p-6"
                variants={pageEnter}
                initial="hidden"
                animate="visible"
            >
                <LookupPageHeader
                    addHref="/lookups/departments/create"
                    addLabel="Add department"
                />

                <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="border-b bg-muted/40 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Code</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-4 py-12 text-center text-muted-foreground"
                                    >
                                        No departments.{' '}
                                        <Link
                                            href="/lookups/departments/create"
                                            className="text-primary hover:underline"
                                        >
                                            Add one
                                        </Link>
                                    </td>
                                </tr>
                            ) : (
                                records.map((row) => (
                                    <tr
                                        key={row.id}
                                        className="border-b border-border/40 hover:bg-muted/20"
                                    >
                                        <td className="px-4 py-3 font-medium">
                                            {row.name}
                                        </td>
                                        <td className="px-4 py-3 font-mono text-xs">
                                            {row.code}
                                        </td>
                                        <td className="px-4 py-3">
                                            {row.is_active ? (
                                                <span className="text-emerald-600">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <ListRowActions
                                                viewHref={`/lookups/departments/${row.id}`}
                                                editHref={`/lookups/departments/${row.id}/edit`}
                                                deleteUrl={`/lookups/departments/${row.id}`}
                                                itemLabel={row.name}
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </>
    );
}

DepartmentsIndex.layout = { title: 'Departments' };
