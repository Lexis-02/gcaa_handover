import { Form, Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    AtSign,
    Bell,
    Building2,
    Calendar,
    ClipboardCheck,
    Clock,
    IdCard,
    Sparkles,
    User,
} from 'lucide-react';
import DeleteUser from '@/components/delete-user';
import { FormInput } from '@/components/form-input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useInitials } from '@/hooks/use-initials';
import { pageItem, pageStagger, springSoft } from '@/lib/motion';
import { cn } from '@/lib/utils';

type ProfileData = {
    id: number;
    name: string;
    username: string;
    is_active: boolean;
    roles: string[];
    primary_role: string;
    department: { name: string; code: string } | null;
    staff: {
        full_name: string;
        staff_number: string;
        designation: string | null;
    } | null;
    last_login_at: string | null;
    last_login_human: string | null;
    member_since: string | null;
};

type RoleMeta = {
    title: string;
    subtitle: string;
    greeting: string;
};

type PageProps = {
    profile: ProfileData;
    role_meta: RoleMeta;
    stats: { sign_off_queue: number; unread_notifications: number };
    must_verify_email: boolean;
    status?: string;
};

function formatRole(role: string): string {
    return role.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function InfoTile({
    icon: Icon,
    label,
    value,
    sub,
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: React.ReactNode;
    sub?: string;
}) {
    return (
        <div className="flex gap-3 rounded-xl border border-border/50 bg-background/80 p-3.5">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-4" />
            </div>
            <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">{label}</p>
                <p className="mt-0.5 text-sm font-semibold">{value}</p>
                {sub && (
                    <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
                )}
            </div>
        </div>
    );
}

function QuickLink({
    href,
    icon: Icon,
    title,
    description,
    badge,
    index,
}: {
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    badge?: number;
    index: number;
}) {
    return (
        <motion.div variants={pageItem} custom={index}>
            <Link
                href={href}
                className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4 shadow-sm transition-colors hover:border-primary/30 hover:bg-primary/5"
            >
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted/80 text-muted-foreground transition-colors group-hover:bg-primary/15 group-hover:text-primary">
                    <Icon className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="font-medium">{title}</p>
                    <p className="text-xs text-muted-foreground">{description}</p>
                </div>
                {badge !== undefined && badge > 0 && (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
                        {badge > 9 ? '9+' : badge}
                    </span>
                )}
            </Link>
        </motion.div>
    );
}

export default function ProfileIndex({
    profile,
    role_meta,
    stats,
    status,
}: PageProps) {
    const getInitials = useInitials();

    return (
        <>
            <Head title="My profile" />
            <motion.div
                className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-4 md:p-6"
                variants={pageStagger}
                initial="hidden"
                animate="visible"
            >
                {/* Hero */}
                <motion.section
                    variants={pageItem}
                    className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/15 via-card to-card p-6 shadow-sm md:p-8"
                >
                    <div className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full bg-primary/20 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-20 -left-10 size-40 rounded-full bg-emerald-400/10 blur-3xl" />

                    <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
                        <motion.div
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={springSoft}
                        >
                            <Avatar className="size-24 border-4 border-card shadow-lg ring-2 ring-primary/20 md:size-28">
                                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-2xl font-bold text-primary-foreground md:text-3xl">
                                    {getInitials(profile.name)}
                                </AvatarFallback>
                            </Avatar>
                        </motion.div>

                        <div className="min-w-0 flex-1 space-y-3">
                            <div className="flex flex-wrap items-center gap-2">
                                <motion.span
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary"
                                >
                                    <Sparkles className="size-3" />
                                    {role_meta.greeting}
                                </motion.span>
                                <span
                                    className={cn(
                                        'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                                        profile.is_active
                                            ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300'
                                            : 'bg-muted text-muted-foreground',
                                    )}
                                >
                                    {profile.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>

                            <motion.h1
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                className="text-2xl font-bold tracking-tight md:text-3xl"
                            >
                                {profile.name}
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="flex items-center gap-1.5 font-mono text-sm text-muted-foreground"
                            >
                                <AtSign className="size-4" />
                                {profile.username}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.25 }}
                                className="flex flex-wrap gap-2"
                            >
                                {profile.roles.map((role, i) => (
                                    <motion.span
                                        key={role}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.3 + i * 0.05 }}
                                        className={cn(
                                            'rounded-lg px-2.5 py-1 text-xs font-medium',
                                            role === profile.primary_role
                                                ? 'bg-primary text-primary-foreground shadow-sm'
                                                : 'bg-muted/80 text-muted-foreground',
                                        )}
                                    >
                                        {formatRole(role)}
                                    </motion.span>
                                ))}
                            </motion.div>

                            <p className="max-w-lg text-sm text-muted-foreground">
                                {role_meta.subtitle}
                            </p>
                        </div>
                    </div>
                </motion.section>

                {/* Stats strip */}
                <motion.div
                    variants={pageItem}
                    className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
                >
                    <InfoTile
                        icon={Building2}
                        label="Department"
                        value={profile.department?.name ?? '—'}
                    />
                    <InfoTile
                        icon={IdCard}
                        label="Staff profile"
                        value={profile.staff?.full_name ?? '—'}
                        sub={profile.staff?.staff_number}
                    />
                    <InfoTile
                        icon={Clock}
                        label="Last login"
                        value={profile.last_login_at ?? '—'}
                        sub={profile.last_login_human ?? undefined}
                    />
                    <InfoTile
                        icon={Calendar}
                        label="Member since"
                        value={profile.member_since ?? '—'}
                    />
                </motion.div>

                <div className="grid gap-6 lg:grid-cols-5">
                    {/* Edit profile */}
                    <motion.section
                        variants={pageItem}
                        className="space-y-6 lg:col-span-3"
                    >
                        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm md:p-6">
                            <div className="mb-5 flex items-center gap-2">
                                <User className="size-5 text-primary" />
                                <h2 className="text-lg font-semibold">
                                    Edit profile
                                </h2>
                            </div>

                            {status === 'verification-link-sent' && (
                                <p className="mb-4 rounded-lg bg-primary/10 px-3 py-2 text-sm text-primary">
                                    A new verification link has been sent to your
                                    email address.
                                </p>
                            )}

                            <Form
                                action="/profile"
                                method="patch"
                                className="space-y-5"
                                options={{ preserveScroll: true }}
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <FormInput
                                            id="name"
                                            label="Display name"
                                            name="name"
                                            required
                                            autoComplete="name"
                                            defaultValue={profile.name}
                                            icon={User}
                                            error={errors.name}
                                        />
                                        <FormInput
                                            id="username"
                                            label="Username"
                                            name="username"
                                            required
                                            autoComplete="username"
                                            defaultValue={profile.username}
                                            icon={AtSign}
                                            error={errors.username}
                                        />
                                        <motion.div
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className="w-full sm:w-auto"
                                            >
                                                {processing
                                                    ? 'Saving…'
                                                    : 'Save changes'}
                                            </Button>
                                        </motion.div>
                                    </>
                                )}
                            </Form>
                        </div>

                        <motion.div variants={pageItem}>
                            <DeleteUser />
                        </motion.div>
                    </motion.section>

                    {/* Sidebar */}
                    <div className="space-y-4 lg:col-span-2">
                        <motion.div
                            variants={pageItem}
                            className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm"
                        >
                            <h3 className="text-sm font-semibold">Workspace</h3>
                            <p className="mt-1 text-xs text-muted-foreground">
                                {role_meta.title}
                            </p>
                            <div className="mt-4 space-y-2">
                                <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2 text-sm">
                                    <span className="flex items-center gap-2 text-muted-foreground">
                                        <ClipboardCheck className="size-4" />
                                        Sign-off queue
                                    </span>
                                    <span className="font-mono font-bold">
                                        {stats.sign_off_queue}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2 text-sm">
                                    <span className="flex items-center gap-2 text-muted-foreground">
                                        <Bell className="size-4" />
                                        Notifications
                                    </span>
                                    <span className="font-mono font-bold">
                                        {stats.unread_notifications}
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        <div className="space-y-3">
                            <p className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Quick links
                            </p>
                            <QuickLink
                                index={0}
                                href="/handover-sign-offs"
                                icon={ClipboardCheck}
                                title="Sign-offs"
                                description="PCs waiting for your signature"
                                badge={stats.sign_off_queue}
                            />
                            <QuickLink
                                index={1}
                                href="/notifications"
                                icon={Bell}
                                title="Notifications"
                                description="Alerts and handover updates"
                                badge={stats.unread_notifications}
                            />
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
}

ProfileIndex.layout = {
    title: 'My profile',
};
