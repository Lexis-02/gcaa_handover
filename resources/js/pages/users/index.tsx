import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Link2, Search, UserPlus, Users } from 'lucide-react';
import { useState } from 'react';
import { ListRowActions } from '@/components/list-row-actions';
import { SmartPagination } from '@/components/smart-pagination';
import { Button } from '@/components/ui/button';
import { pageEnter } from '@/lib/motion';
import { cn } from '@/lib/utils';

type UserRecord = {
    id: number;
    name: string;
    username: string;
    department: { name: string } | null;
    staff: { full_name: string } | null;
    role: string | null;
    role_label: string | null;
    is_active: boolean;
    last_login_at: string | null;
    can_delete: boolean;
};

type PaginatedRecords = {
    data: UserRecord[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

type PageProps = {
    records: PaginatedRecords;
    filters: { q: string };
};

export default function UsersIndex({ records, filters }: PageProps) {
    const [search, setSearch] = useState(filters.q);

    const submitSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/users',
            { q: search.trim() || undefined },
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <>
            <Head title="Users" />
            <motion.div
                className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-4 md:p-6"
                variants={pageEnter}
                initial="hidden"
                animate="visible"
            >
                <div className="mb-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex gap-4">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                                <Users className="size-6" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold tracking-tight">
                                    User accounts
                                </h2>
                                <p className="mt-1 max-w-lg text-sm text-muted-foreground">
                                    View and manage system users, roles, and
                                    departments.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button asChild size="sm" variant="outline">
                                <Link href="/users/invitations">
                                    <Link2 className="size-4" />
                                    Registration links
                                </Link>
                            </Button>
                            <Button asChild size="sm">
                                <Link href="/users/create">
                                    <UserPlus className="size-4" />
                                    Add user
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-muted-foreground">
                        {records.total}{' '}
                        {records.total === 1 ? 'user' : 'users'}
                        {filters.q && (
                            <>
                                {' '}
                                matching &ldquo;
                                <span className="font-medium text-foreground">
                                    {filters.q}
                                </span>
                                &rdquo;
                            </>
                        )}
                    </p>
                    <form
                        onSubmit={submitSearch}
                        className="flex w-full max-w-sm gap-2 sm:ml-auto"
                    >
                        <div className="relative min-w-0 flex-1">
                            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search name or username…"
                                className="h-9 w-full rounded-lg border border-border/60 bg-background pr-3 pl-9 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
                            />
                        </div>
                        <Button type="submit" size="sm">
                            Search
                        </Button>
                        {filters.q && (
                            <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                    setSearch('');
                                    router.get('/users', {}, { preserveScroll: true });
                                }}
                            >
                                Clear
                            </Button>
                        )}
                    </form>
                </div>

                <div className="overflow-hidden">
                    <div className="custom-scrollbar overflow-x-auto">
                        <table className="w-full border-collapse text-sm">
                            <thead>
                                <tr className="border-b border-border/60 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Username</th>
                                    <th className="px-4 py-3">Role</th>
                                    <th className="px-4 py-3">Department</th>
                                    <th className="px-4 py-3">Last login</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-4 py-12 text-center text-muted-foreground"
                                        >
                                            No users found.{' '}
                                            <Link
                                                href="/users/create"
                                                className="font-medium text-primary hover:underline"
                                            >
                                                Add a user
                                            </Link>{' '}
                                            or{' '}
                                            <Link
                                                href="/users/invitations"
                                                className="font-medium text-primary hover:underline"
                                            >
                                                generate a registration link
                                            </Link>
                                            .
                                        </td>
                                    </tr>
                                ) : (
                                    records.data.map((row) => (
                                        <tr
                                            key={row.id}
                                            className="border-b border-border/40 hover:bg-muted/20"
                                        >
                                            <td className="px-4 py-3">
                                                <Link
                                                    href={`/users/${row.id}`}
                                                    className="font-medium text-primary hover:underline"
                                                >
                                                    {row.name}
                                                </Link>
                                                {/* {row.staff?.full_name && (
                                                    <p className="text-xs text-muted-foreground">
                                                        Staff:{' '}
                                                        {row.staff.full_name}
                                                    </p>
                                                )} */}
                                            </td>
                                            <td className="px-4 py-3 font-mono text-xs">
                                                {row.username}
                                            </td>
                                            <td className="px-4 py-3">
                                                {row.role_label ?? '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                {row.department?.name ?? '—'}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {row.last_login_at ?? 'Never'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={cn(
                                                        'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                                                        row.is_active
                                                            ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300'
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
                </div>

                <SmartPagination
                    meta={records}
                    path="/users"
                    query={{ q: filters.q || undefined }}
                />
            </motion.div>
        </>
    );
}

UsersIndex.layout = { title: 'Users' };
