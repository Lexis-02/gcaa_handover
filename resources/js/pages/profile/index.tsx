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
    User,
} from 'lucide-react';
import DeleteUser from '@/components/delete-user';
import { FormInput } from '@/components/form-input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useInitials } from '@/hooks/use-initials';
import { pageItem, pageStagger } from '@/lib/motion';
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


function QuickLink({
    href,
    icon: Icon,
    title,
    description,
    badge,
}: {
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    badge?: number;
}) {
    return (
        <Link
            href={href}
            className="group flex items-center gap-3 px-5 py-4 transition-colors hover:bg-muted/20"
        >
            <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                <Icon className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
            </div>
            {badge !== undefined && badge > 0 && (
                <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-xs font-bold text-primary-foreground">
                    {badge > 9 ? '9+' : badge}
                </span>
            )}
        </Link>
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
                className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 p-4 md:p-6"
                variants={pageStagger}
                initial="hidden"
                animate="visible"
            >
                {/* Header Card */}
                <motion.section
                    variants={pageItem}
                    className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm"
                >
                    <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center md:p-8">
                        <Avatar className="size-20 border border-border/50 bg-muted md:size-24">
                            <AvatarFallback className="text-xl font-medium text-muted-foreground md:text-2xl">
                                {getInitials(profile.name)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0 flex-1 space-y-3">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                                    {profile.name}
                                </h1>
                                <span
                                    className={cn(
                                        'ml-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
                                        profile.is_active
                                            ? 'bg-emerald-500/10 text-emerald-800 ring-emerald-500/20 dark:text-emerald-300'
                                            : 'bg-muted text-muted-foreground ring-border',
                                    )}
                                >
                                    {profile.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                <p className="flex items-center gap-1.5 font-mono text-sm text-muted-foreground">
                                    <AtSign className="size-4" />
                                    {profile.username}
                                </p>
                                <div className="hidden h-4 w-px bg-border sm:block" />
                                <div className="flex flex-wrap gap-2">
                                    {profile.roles.map((role) => (
                                        <span
                                            key={role}
                                            className={cn(
                                                'inline-flex rounded-md px-2 py-0.5 text-xs font-medium',
                                                role === profile.primary_role
                                                    ? 'bg-primary/10 text-primary'
                                                    : 'bg-muted text-muted-foreground',
                                            )}
                                        >
                                            {formatRole(role)}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <p className="text-sm text-muted-foreground">
                                {role_meta.subtitle}
                            </p>
                        </div>
                    </div>
                    
                    {/* Stats strip attached to bottom of header */}
                    <div className="grid border-t border-border/60 bg-muted/15 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="flex items-center gap-3 border-b border-border/60 p-4 sm:border-b-0 sm:border-r lg:p-5">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-background text-muted-foreground shadow-sm ring-1 ring-border/50">
                                <Building2 className="size-4" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-medium text-muted-foreground">Department</p>
                                <p className="mt-0.5 text-sm font-semibold text-foreground">{profile.department?.name ?? '—'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 border-b border-border/60 p-4 sm:border-b-0 lg:border-r lg:p-5">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-background text-muted-foreground shadow-sm ring-1 ring-border/50">
                                <IdCard className="size-4" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-medium text-muted-foreground">Staff profile</p>
                                <p className="mt-0.5 text-sm font-semibold text-foreground truncate">{profile.staff?.full_name ?? '—'}</p>
                                {profile.staff?.staff_number && (
                                    <p className="text-xs text-muted-foreground">{profile.staff.staff_number}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-3 border-b border-border/60 p-4 sm:border-b-0 sm:border-r lg:p-5">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-background text-muted-foreground shadow-sm ring-1 ring-border/50">
                                <Clock className="size-4" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-medium text-muted-foreground">Last login</p>
                                <p className="mt-0.5 text-sm font-semibold text-foreground">{profile.last_login_at ?? '—'}</p>
                                {profile.last_login_human && (
                                    <p className="text-xs text-muted-foreground">{profile.last_login_human}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 lg:p-5">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-background text-muted-foreground shadow-sm ring-1 ring-border/50">
                                <Calendar className="size-4" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-medium text-muted-foreground">Member since</p>
                                <p className="mt-0.5 text-sm font-semibold text-foreground">{profile.member_since ?? '—'}</p>
                            </div>
                        </div>
                    </div>
                </motion.section>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Column */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Edit profile */}
                        <motion.section
                            variants={pageItem}
                            className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm"
                        >
                            <div className="border-b border-border/50 bg-muted/25 px-5 py-3.5">
                                <div className="flex items-center gap-2.5">
                                    <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <User className="size-4" />
                                    </span>
                                    <h2 className="text-sm font-semibold tracking-tight">
                                        Edit profile
                                    </h2>
                                </div>
                            </div>
                            
                            <div className="p-5">
                                {status === 'verification-link-sent' && (
                                    <p className="mb-5 rounded-lg bg-emerald-500/10 px-4 py-3 text-sm text-emerald-800 dark:text-emerald-300">
                                        A new verification link has been sent to your email address.
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
                                            <div className="grid gap-5 sm:grid-cols-2">
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
                                            </div>
                                            
                                            <div className="flex justify-end border-t border-border/40 pt-5">
                                                <Button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="w-full sm:w-auto"
                                                >
                                                    {processing ? 'Saving…' : 'Save changes'}
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </Form>
                            </div>
                        </motion.section>

                        <motion.div variants={pageItem}>
                            <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
                                <div className="p-5 sm:p-6">
                                    <DeleteUser />
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar Column */}
                    <div className="space-y-6 lg:col-span-1">
                        <motion.div
                            variants={pageItem}
                            className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm"
                        >
                            <div className="border-b border-border/50 bg-muted/25 px-5 py-3.5">
                                <h3 className="text-sm font-semibold tracking-tight">Quick links</h3>
                            </div>
                            <div className="flex flex-col divide-y divide-border/40">
                                <QuickLink
                                    href="/handover-sign-offs"
                                    icon={ClipboardCheck}
                                    title="Sign-offs"
                                    description="PCs waiting for your signature"
                                    badge={stats.sign_off_queue}
                                />
                                <QuickLink
                                    href="/notifications"
                                    icon={Bell}
                                    title="Notifications"
                                    description="Alerts and handover updates"
                                    badge={stats.unread_notifications}
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </>
    );
}

ProfileIndex.layout = {
    title: 'My profile',
};
