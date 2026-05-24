import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    BellRing,
    CheckCheck,
    ChevronRight,
    Monitor,
    Volume2,
    VolumeX,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    isHandoverAlertSoundEnabled,
    setHandoverAlertSoundEnabled,
} from '@/hooks/use-handover-notification-alerts';
import {
    playHandoverAlertSound,
    unlockHandoverAlertSound,
} from '@/lib/handover-alert-sound';
import { pageEnter } from '@/lib/motion';
import { cn } from '@/lib/utils';

type NotificationItem = {
    id: string;
    read_at: string | null;
    created_at: string;
    created_human: string;
    ref_no: string;
    stage: number;
    stage_label: string;
    stage_description: string;
    headline: string;
    message: string;
    action_url: string;
    end_user?: string | null;
    department?: string | null;
};

type StageMeta = {
    label: string;
    description: string;
    signer_role: string | null;
};

type PageProps = {
    notifications: NotificationItem[];
    unread_count: number;
    stages: StageMeta[];
};

function StagePipeline({
    currentStage,
    stages,
}: {
    currentStage: number;
    stages: StageMeta[];
}) {
    const steps = stages.slice(0, 3);

    return (
        <div className="flex items-center gap-1">
            {steps.map((step, index) => {
                const stageNum = index + 1;
                const active = currentStage === stageNum;
                const done = currentStage > stageNum || currentStage === 0;

                return (
                    <div key={step.label} className="flex items-center gap-1">
                        <div
                            className={cn(
                                'flex size-7 items-center justify-center rounded-full text-[10px] font-bold',
                                active &&
                                    'bg-primary text-primary-foreground ring-4 ring-primary/20',
                                done &&
                                    !active &&
                                    'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300',
                                !active &&
                                    !done &&
                                    'bg-muted text-muted-foreground',
                            )}
                            title={step.description}
                        >
                            {stageNum}
                        </div>
                        {index < steps.length - 1 && (
                            <div
                                className={cn(
                                    'h-0.5 w-4 rounded-full',
                                    done ? 'bg-emerald-400/60' : 'bg-border',
                                )}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default function NotificationsIndex({
    notifications,
    unread_count,
    stages,
}: PageProps) {
    const [soundOn, setSoundOn] = useState(isHandoverAlertSoundEnabled);

    const toggleSound = () => {
        const next = !soundOn;
        setSoundOn(next);
        setHandoverAlertSoundEnabled(next);
        if (next) {
            void unlockHandoverAlertSound().then(() => playHandoverAlertSound());
        }
    };

    const markAllRead = () => {
        router.post('/notifications/read-all', {}, { preserveScroll: true });
    };

    const markRead = (id: string) => {
        router.post(`/notifications/${id}/read`, {}, { preserveScroll: true });
    };

    return (
        <>
            <Head title="Notifications" />
            <motion.div
                className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-4 md:p-6"
                variants={pageEnter}
                initial="hidden"
                animate="visible"
            >
                <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-6 shadow-sm">
                    <div className="pointer-events-none absolute -top-8 -right-8 size-32 rounded-full bg-primary/10 blur-2xl" />
                    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex gap-4">
                            <div
                                className={cn(
                                    'flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary',
                                    unread_count > 0 && 'animate-pulse',
                                )}
                            >
                                <BellRing className="size-6" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold tracking-tight">
                                    Handover alerts
                                </h2>
                                <p className="mt-1 max-w-md text-sm text-muted-foreground">
                                    When a PC enters your sign-off stage, your
                                    workstation plays a classic alert tone so
                                    you never miss the queue.
                                </p>
                                {unread_count > 0 && (
                                    <p className="mt-2 text-sm font-medium text-primary">
                                        {unread_count} waiting for your
                                        attention
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={toggleSound}
                                className="gap-2"
                            >
                                {soundOn ? (
                                    <Volume2 className="size-4" />
                                ) : (
                                    <VolumeX className="size-4" />
                                )}
                                {soundOn ? 'Sound on' : 'Sound muted'}
                            </Button>
                            {unread_count > 0 && (
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="secondary"
                                    onClick={markAllRead}
                                    className="gap-2"
                                >
                                    <CheckCheck className="size-4" />
                                    Mark all read
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className="relative mt-4 flex items-center gap-2 rounded-lg border border-border/50 bg-background/60 px-3 py-2 text-xs text-muted-foreground">
                        <Monitor className="size-4 shrink-0 text-primary" />
                        Pipeline: Stores pick-up → Director receipt → End-user
                        issue → Old PC return
                    </div>
                </div>

                <div className="space-y-3">
                    {notifications.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-border/60 bg-card px-6 py-16 text-center">
                            <BellRing className="mx-auto size-10 text-muted-foreground/40" />
                            <p className="mt-4 font-medium">All quiet</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                New sign-off requests will appear here with a
                                PC alert sound.
                            </p>
                            <Link
                                href="/handover-sign-offs"
                                className="mt-4 inline-flex text-sm font-medium text-primary hover:underline"
                            >
                                View sign-off queue
                            </Link>
                        </div>
                    ) : (
                        notifications.map((item, index) => {
                            const unread = !item.read_at;

                            return (
                                <motion.article
                                    key={item.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.04 }}
                                    className={cn(
                                        'rounded-xl border bg-card p-4 shadow-sm transition-shadow',
                                        unread
                                            ? 'border-primary/30 ring-1 ring-primary/10'
                                            : 'border-border/60',
                                    )}
                                >
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="min-w-0 flex-1 space-y-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                {unread && (
                                                    <span className="inline-flex rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
                                                        New
                                                    </span>
                                                )}
                                                <span className="font-mono text-xs font-semibold text-primary">
                                                    {item.ref_no}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {item.created_human}
                                                </span>
                                            </div>
                                            <h3 className="font-semibold leading-snug">
                                                {item.headline}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {item.message}
                                            </p>
                                            {(item.end_user ||
                                                item.department) && (
                                                <p className="text-xs text-muted-foreground">
                                                    {item.end_user}
                                                    {item.department
                                                        ? ` · ${item.department}`
                                                        : ''}
                                                </p>
                                            )}
                                            <StagePipeline
                                                currentStage={item.stage}
                                                stages={stages}
                                            />
                                        </div>
                                        <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                                            <Link
                                                href={item.action_url}
                                                className="inline-flex h-9 items-center gap-1 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                                            >
                                                Open queue
                                                <ChevronRight className="size-4" />
                                            </Link>
                                            {unread && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => markRead(item.id)}
                                                    className="h-8 text-xs text-muted-foreground hover:text-foreground"
                                                >
                                                    Dismiss
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </motion.article>
                            );
                        })
                    )}
                </div>
            </motion.div>
        </>
    );
}

NotificationsIndex.layout = {
    title: 'Notifications',
};
