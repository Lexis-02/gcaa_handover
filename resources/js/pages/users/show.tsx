import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Building2,
    Calendar,
    Clock,
    Pencil,
    Shield,
    User,
} from 'lucide-react';
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
    role: string | null;
    role_label: string | null;
    is_active: boolean;
    last_login_at: string | null;
    created_at: string | null;
    updated_at: string | null;
};

function InfoTile({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: React.ReactNode;
}) {
    return (
        <div className="flex gap-3 p-2">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-4" />
            </div>
            <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {label}
                </p>
                <p className="mt-0.5 text-sm font-medium">{value ?? '—'}</p>
            </div>
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

    const initials = record.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return (
        <>
            <Head title={`${record.name} — User`} />
            <motion.div
                className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-4 md:p-6"
                variants={pageEnter}
                initial="hidden"
                animate="visible"
            >
                <section className="mb-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex gap-4">
                            <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-xl font-bold text-primary">
                                {initials}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">
                                    {record.name}
                                </h1>
                                <p className="mt-1 font-mono text-sm text-muted-foreground">
                                    @{record.username}
                                </p>
                                <span
                                    className={cn(
                                        'mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold',
                                        record.is_active
                                            ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300'
                                            : 'bg-muted text-muted-foreground',
                                    )}
                                >
                                    {record.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {meta.can_edit && (
                                <Button asChild variant="outline" size="sm">
                                    <Link href={`/users/${record.id}/edit`}>
                                        <Pencil className="size-4" />
                                        Edit
                                    </Link>
                                </Button>
                            )}
                            {meta.can_delete && (
                                <Button
                                    type="button"
                                    variant="destructive-outline"
                                    size="sm"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </Button>
                            )}
                            <Button asChild variant="ghost" size="sm">
                                <Link href="/users">Back</Link>
                            </Button>
                        </div>
                    </div>
                </section>

                <section className="grid gap-3 sm:grid-cols-2">
                    <InfoTile
                        icon={Shield}
                        label="Role"
                        value={record.role_label}
                    />
                    <InfoTile
                        icon={Building2}
                        label="Department"
                        value={record.department?.name}
                    />
                    <InfoTile
                        icon={User}
                        label="Staff profile"
                        value={record.staff?.full_name}
                    />
                    <InfoTile
                        icon={Clock}
                        label="Last login"
                        value={record.last_login_at ?? 'Never'}
                    />
                    <InfoTile
                        icon={Calendar}
                        label="Created"
                        value={record.created_at}
                    />
                    <InfoTile
                        icon={Calendar}
                        label="Last updated"
                        value={record.updated_at}
                    />
                </section>
            </motion.div>
        </>
    );
}

UsersShow.layout = { title: 'View user' };
