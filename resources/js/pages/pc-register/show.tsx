import { Head, Link, router } from '@inertiajs/react';
import {
    Building2,
    Check,
    ChevronLeft,
    Cpu,
    Pencil,
    Trash2,
    User,
    X,
    type LucideIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
    HandoverStageProgress,
    type StageProgress,
} from '@/components/handover-stage-progress';
import {
    HandoverOversightBadge,
    type HandoverOversight,
} from '@/components/handover-oversight-badge';
import { SignOffButton } from '@/components/sign-off-button';
import { Button } from '@/components/ui/button';
import { confirmDelete } from '@/lib/sweetalert';
import { pageEnter } from '@/lib/motion';
import { cn } from '@/lib/utils';

type RegisterRecord = {
    id: number;
    ref_no: string;
    asset_tag: string | null;
    make_model: string;
    serial_number: string;
    hostname: string | null;
    os: string;
    condition_on_issue: string;
    status: string;
    room_ext: string | null;
    batch: { batch_code: string; year: number } | null;
    department: { name: string; code: string } | null;
    building: { name: string } | null;
    assignee: {
        full_name: string;
        staff_number: string;
        designation: string | null;
    } | null;
    stores_issue_date: string | null;
    form_1_signed: boolean;
    director_receipt_date: string | null;
    form_2_signed: boolean;
    end_user_receipt_date: string | null;
    form_3_signed: boolean;
    old_pc_returned: boolean;
    stage_progress: StageProgress;
    next_signer: string | null;
};

type SignOffAction = {
    stage: number;
    title: string;
    description: string;
    form_ref: string;
};

type PageProps = {
    record: RegisterRecord;
    meta: {
        can_edit: boolean;
        can_delete: boolean;
        sign_off: SignOffAction | null;
        handover_oversight: HandoverOversight | null;
    };
    status_labels: Record<string, string>;
};

function statusBadgeClass(status: string): string {
    switch (status) {
        case 'complete':
            return 'border-emerald-500/30 bg-emerald-500/12 text-emerald-800 dark:text-emerald-300';
        case 'pending':
            return 'border-amber-500/35 bg-amber-500/12 text-amber-900 dark:text-amber-200';
        case 'faulty_on_arrival':
            return 'border-destructive/35 bg-destructive/10 text-destructive';
        default:
            return 'border-primary/25 bg-primary/10 text-primary';
    }
}

function DetailCell({
    label,
    value,
    className,
}: {
    label: string;
    value: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                'rounded-lg border border-border/50 bg-muted/15 px-4 py-3',
                className,
            )}
        >
            <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {label}
            </dt>
            <dd className="mt-1.5 text-sm font-medium leading-snug text-foreground">
                {value ?? '—'}
            </dd>
        </div>
    );
}

function SignedBadge({ signed }: { signed: boolean }) {
    return signed ? (
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/12 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:text-emerald-300">
            <Check className="size-3" strokeWidth={2.5} />
            Yes
        </span>
    ) : (
        <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 px-2 py-0.5 text-xs font-medium text-muted-foreground">
            <X className="size-3" strokeWidth={2.5} />
            No
        </span>
    );
}

function SectionCard({
    title,
    icon: Icon,
    children,
    action,
}: {
    title: string;
    icon: LucideIcon;
    children: React.ReactNode;
    action?: React.ReactNode;
}) {
    return (
        <section className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-border/50 bg-muted/25 px-5 py-3.5">
                <div className="flex items-center gap-2.5">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="size-4" />
                    </span>
                    <h2 className="text-sm font-semibold tracking-tight">
                        {title}
                    </h2>
                </div>
                {action}
            </div>
            <div className="p-5">{children}</div>
        </section>
    );
}

export default function PcRegisterShow({
    record,
    meta,
    status_labels,
}: PageProps) {
    const handleDelete = async () => {
        const confirmed = await confirmDelete(record.ref_no);

        if (!confirmed) {
            return;
        }

        router.delete(`/pc-register/${record.id}`);
    };

    const statusLabel = status_labels[record.status] ?? record.status;

    return (
        <>
            <Head title={`${record.ref_no} — Register`} />
            <motion.div
                className="mx-auto flex w-full max-w-4xl flex-1 flex-col"
                variants={pageEnter}
                initial="hidden"
                animate="visible"
            >
                {/* Sticky page header — stays visible while scrolling content */}
                <header
                    className={cn(
                        'sticky top-0 z-20 -mx-4 border-b border-border/60 px-4 py-4 md:-mx-6 md:px-6',
                        'bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/80',
                        'shadow-[0_1px_0_0_rgba(0,0,0,0.04)]',
                    )}
                >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0 space-y-2">
                            <Button
                                asChild
                                variant="ghost"
                                size="sm"
                                className="-ml-2 h-8 px-2 text-muted-foreground"
                            >
                                <Link href="/pc-register">
                                    <ChevronLeft className="size-4" />
                                    Back to register
                                </Link>
                            </Button>
                            <div className="flex flex-wrap items-center gap-2">
                                <span
                                    className={cn(
                                        'inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold',
                                        statusBadgeClass(record.status),
                                    )}
                                >
                                    {statusLabel}
                                </span>
                                {record.batch && (
                                    <span className="text-xs text-muted-foreground">
                                        {record.batch.batch_code}
                                    </span>
                                )}
                            </div>
                            <h1 className="font-mono text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                                {record.ref_no}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {record.make_model}
                                <span className="mx-1.5 text-border">·</span>
                                {record.serial_number}
                            </p>
                        </div>

                        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
                            {meta.sign_off && (
                                <SignOffButton
                                    pcId={record.id}
                                    signOff={meta.sign_off}
                                    redirect="register"
                                    size="default"
                                />
                            )}
                            {!meta.sign_off && meta.handover_oversight && (
                                <HandoverOversightBadge
                                    oversight={meta.handover_oversight}
                                    awaiting={record.next_signer}
                                />
                            )}
                            {meta.can_edit && (
                                <Button asChild variant="outline" size="default">
                                    <Link href={`/pc-register/${record.id}/edit`}>
                                        <Pencil className="size-4" />
                                        Edit
                                    </Link>
                                </Button>
                            )}
                            {meta.can_delete && (
                                <Button
                                    type="button"
                                    variant="destructive-outline"
                                    size="default"
                                    onClick={handleDelete}
                                >
                                    <Trash2 className="size-4" />
                                    Delete
                                </Button>
                            )}
                        </div>
                    </div>
                </header>

                <div className="flex flex-col gap-6 px-4 py-6 md:px-6">
                    {record.next_signer && !meta.handover_oversight && (
                        <div
                            className={cn(
                                'flex items-start gap-3 rounded-xl border border-amber-500/35',
                                'bg-gradient-to-r from-amber-500/12 to-amber-500/5 px-4 py-3.5',
                            )}
                        >
                            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-200">
                                !
                            </span>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-amber-800/80 dark:text-amber-200/80">
                                    Awaiting sign-off
                                </p>
                                <p className="mt-0.5 text-sm font-medium text-amber-950 dark:text-amber-50">
                                    {record.next_signer}
                                </p>
                            </div>
                        </div>
                    )}

                    <SectionCard title="PC details" icon={Cpu}>
                        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            <DetailCell
                                label="Asset tag"
                                value={record.asset_tag}
                            />
                            <DetailCell
                                label="Make / model"
                                value={record.make_model}
                            />
                            <DetailCell
                                label="Serial number"
                                value={record.serial_number}
                            />
                            <DetailCell
                                label="Hostname"
                                value={record.hostname}
                            />
                            <DetailCell label="OS" value={record.os} />
                            <DetailCell
                                label="Condition on issue"
                                value={record.condition_on_issue}
                            />
                            <DetailCell
                                label="Room / ext."
                                value={record.room_ext}
                            />
                            <DetailCell
                                label="Department"
                                value={record.department?.name}
                            />
                            <DetailCell
                                label="Building"
                                value={record.building?.name}
                            />
                        </dl>
                    </SectionCard>

                    <SectionCard title="Assignment" icon={User}>
                        <dl className="grid gap-3 sm:grid-cols-2">
                            <DetailCell
                                label="End user"
                                value={record.assignee?.full_name}
                                className="sm:col-span-2"
                            />
                            <DetailCell
                                label="Staff number"
                                value={record.assignee?.staff_number}
                            />
                            <DetailCell
                                label="Designation"
                                value={record.assignee?.designation}
                            />
                        </dl>
                    </SectionCard>

                    <SectionCard
                        title="Handover progress"
                        icon={Building2}
                        action={
                            <HandoverStageProgress
                                progress={record.stage_progress}
                                compact
                            />
                        }
                    >
                        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            <DetailCell
                                label="Stores issue date"
                                value={record.stores_issue_date}
                            />
                            <DetailCell
                                label="Form 1 signed"
                                value={
                                    <SignedBadge signed={record.form_1_signed} />
                                }
                            />
                            <DetailCell
                                label="Director receipt"
                                value={record.director_receipt_date}
                            />
                            <DetailCell
                                label="Form 2 signed"
                                value={
                                    <SignedBadge signed={record.form_2_signed} />
                                }
                            />
                            <DetailCell
                                label="End-user receipt"
                                value={record.end_user_receipt_date}
                            />
                            <DetailCell
                                label="Form 3 signed"
                                value={
                                    <SignedBadge signed={record.form_3_signed} />
                                }
                            />
                            <DetailCell
                                label="Old PC returned"
                                value={
                                    <SignedBadge
                                        signed={record.old_pc_returned}
                                    />
                                }
                            />
                        </dl>
                    </SectionCard>
                </div>
            </motion.div>
        </>
    );
}

PcRegisterShow.layout = {
    title: 'View',
};
