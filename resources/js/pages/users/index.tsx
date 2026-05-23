import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ListRowActions } from '@/components/list-row-actions';
import { pageEnter } from '@/lib/motion';
import { cn } from '@/lib/utils';

type UserRecord = {
    id: number;
    name: string;
    username: string;
    department: { name: string } | null;
    staff: { full_name: string } | null;
    roles: string[];
    is_active: boolean;
    last_login_at: string | null;
    can_delete: boolean;
};

export default function UsersIndex({ records }: { records: UserRecord[] }) {
    return (
        <>
            <Head title="Users" />
            <motion.div
                className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 p-4 md:p-6"
                variants={pageEnter}
                initial="hidden"
                animate="visible"
            >
                <div className="flex justify-end">
                    <Link
                        href="/users/create"
                        className="inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                        Add user
                    </Link>
                </div>

                <div className="overflow-hidden rounded-xl bg-card shadow-sm ring-1 ring-border/60">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="border-b bg-muted/40 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Username</th>
                                <th className="px-4 py-3">Role</th>
                                <th className="px-4 py-3">Department</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-4 py-12 text-center text-muted-foreground"
                                    >
                                        No users yet.{' '}
                                        <Link
                                            href="/users/create"
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
                                            {row.username}
                                        </td>
                                        <td className="px-4 py-3">
                                            {row.roles.join(', ') || '—'}
                                        </td>
                                        <td className="px-4 py-3">
                                            {row.department?.name ?? '—'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={cn(
                                                    'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                                                    row.is_active
                                                        ? 'bg-emerald-500/15 text-emerald-800'
                                                        : 'bg-muted text-muted-foreground',
                                                )}
                                            >
                                                {row.is_active
                                                    ? 'Active'
                                                    : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <ListRowActions
                                                viewHref={`/users/${row.id}`}
                                                editHref={`/users/${row.id}/edit`}
                                                deleteUrl={`/users/${row.id}`}
                                                itemLabel={row.name}
                                                showDelete={row.can_delete}
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

UsersIndex.layout = { title: 'Users' };
