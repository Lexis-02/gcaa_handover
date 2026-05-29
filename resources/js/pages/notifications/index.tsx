import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    BellRing,
    Building2,
    CheckCheck,
    Clock,
    User,
    Volume2,
    VolumeX,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

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
        <div className="mt-4 flex items-center gap-1.5">
            {steps.map((step, index) => {
                const stageNum = index + 1;
                const active = currentStage === stageNum;
                const done = currentStage > stageNum || currentStage === 0;

                return (
                    <div key={step.label} className="flex items-center gap-1.5">
                        <div
                            className={cn(
                                'flex size-6 items-center justify-center rounded-full text-[10px] font-semibold transition-colors',
                                active && 'bg-primary text-primary-foreground shadow-sm',
                                done && !active && 'bg-muted text-muted-foreground',
                                !active && !done && 'bg-muted/30 text-muted-foreground/40 border border-border/50',
                            )}
                            title={step.description}
                        >
                            {stageNum}
                        </div>
                        {index < steps.length - 1 && (
                            <div
                                className={cn(
                                    'h-px w-6',
                                    done ? 'bg-primary/30' : 'bg-border/50',
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
                className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-4 md:p-8"
                variants={pageEnter}
                initial="hidden"
                animate="visible"
            >
                <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-foreground">
                            Notifications
                            {unread_count > 0 && (
                                <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                    {unread_count} new
                                </span>
                            )}
                        </h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Stay updated on PC handover stages and your sign-off queues.
                        </p>
                    </div>
                    
                    <div className="flex shrink-0 items-center gap-3">
                        {unread_count > 0 && (
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={markAllRead}
                                className="gap-2"
                            >
                                <CheckCheck className="size-4" />
                                Mark all read
                            </Button>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-card/50 py-16 text-center">
                            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                                <BellRing className="size-6 text-muted-foreground/60" />
                            </div>
                            <p className="mt-4 font-medium text-foreground">You're all caught up</p>
                            <p className="mt-1 text-sm text-muted-foreground max-w-sm">
                                There are no new sign-off requests. When a PC enters your queue, it will appear here.
                            </p>
                            <Link
                                href="/handover-sign-offs"
                                className="mt-6 inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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
                                    transition={{ delay: index * 0.03 }}
                                    className={cn(
                                        'group relative rounded-lg border bg-card p-5 shadow-sm transition-all hover:shadow-md',
                                        unread
                                            ? 'border-l-4 border-l-primary border-y-border border-r-border'
                                            : 'border-border',
                                    )}
                                >
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="min-w-0 flex-1">
                                            <div className="mb-2 flex items-center gap-3">
                                                <span className="inline-flex items-center rounded bg-muted px-2 py-0.5 text-xs font-medium font-mono text-muted-foreground">
                                                    {item.ref_no}
                                                </span>
                                                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                    <Clock className="size-3.5" />
                                                    {item.created_human}
                                                </span>
                                            </div>
                                            
                                            <h3 className={cn("text-base font-medium leading-snug", unread ? "text-foreground" : "text-foreground/90")}>
                                                {item.headline}
                                            </h3>
                                            
                                            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                                                {item.message}
                                            </p>
                                            
                                            {(item.end_user || item.department) && (
                                                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                                    {item.end_user && (
                                                        <span className="flex items-center gap-1.5">
                                                            <User className="size-3.5" />
                                                            {item.end_user}
                                                        </span>
                                                    )}
                                                    {item.department && (
                                                        <span className="flex items-center gap-1.5">
                                                            <Building2 className="size-3.5" />
                                                            {item.department}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                            
                                            <StagePipeline
                                                currentStage={item.stage}
                                                stages={stages}
                                            />
                                        </div>
                                        
                                        <div className="flex shrink-0 flex-row items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
                                            <Link
                                                href={item.action_url}
                                                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                                            >
                                                View details
                                                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                                            </Link>
                                            {unread && (
                                                <button
                                                    type="button"
                                                    onClick={() => markRead(item.id)}
                                                    className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                                                >
                                                    Mark as read
                                                </button>
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
