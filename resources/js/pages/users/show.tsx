import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { confirmDelete } from '@/lib/sweetalert';
import { pageEnter } from '@/lib/motion';
import { cn } from '@/lib/utils';

type UserDetail = {
    id: number;
    name: string;
    username: string;
    department: { name: string } | null;
    staff: { full_name: string } | null;
    roles: string[];
    is_active: boolean;
    last_login_at: string | null;
    created_at: string | null;
    updated_at: string | null;
};

function Field({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="space-y-1">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {label}
            </dt>
            <dd className="text-sm font-medium">{value ?? '—'}</dd>
        </div>
    );
}

export default function UsersShow({
    record,
    meta,
}: {
    record: UserDetail;
    meta: { can_edit: boolean; can_delete: boolean };
}) {
    const handleDelete = async () => {
        const confirmed = await confirmDelete(record.name);
        if (!confirmed) return;
        router.delete(`/users/${record.id}`);
    };

    return (
        <>
            <Head title={`${record.name} — User`} />
            <motion.div
                className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-4 md:p-6"
                variants={pageEnter}
                initial="hidden"
                animate="visible"
            >
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">{record.name}</h1>
                        <p className="font-mono text-sm text-muted-foreground">
                            @{record.username}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {meta.can_edit && (
                            <Button asChild variant="outline">
                                <Link href={`/users/${record.id}/edit`}>
                                    Edit
                                </Link>
                            </Button>
                        )}
                        {meta.can_delete && (
                            <Button
                                type="button"
                                variant="destructive-outline"
                                onClick={handleDelete}
                            >
                                Delete
                            </Button>
                        )}
                        <Button asChild variant="ghost">
                            <Link href="/users">Back</Link>
                        </Button>
                    </div>
                </div>

                <section className="rounded-xl bg-card p-6 shadow-sm ring-1 ring-border/60">
                    <dl className="grid gap-4 sm:grid-cols-2">
                        <Field
                            label="Role"
                            value={record.roles
                                .map((r) => r.replace(/_/g, ' '))
                                .join(', ')}
                        />
                        <Field label="Department" value={record.department?.name} />
                        <Field label="Staff profile" value={record.staff?.full_name} />
                        <Field
                            label="Status"
                            value={
                                <span
                                    className={cn(
                                        'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                                        record.is_active
                                            ? 'bg-emerald-500/15 text-emerald-800'
                                            : 'bg-muted text-muted-foreground',
                                    )}
                                >
                                    {record.is_active ? 'Active' : 'Inactive'}
                                </span>
                            }
                        />
                        <Field label="Last login" value={record.last_login_at} />
                        <Field label="Created" value={record.created_at} />
                        <Field label="Updated" value={record.updated_at} />
                    </dl>
                </section>
            </motion.div>
        </>
    );
}

UsersShow.layout = { title: 'View user' };
