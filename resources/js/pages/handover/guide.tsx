import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    AlertCircle,
    ArrowRight,
    CheckCircle2,
    FileText,
    Pen,
} from 'lucide-react';
import type { LegendStage } from '@/components/handover-legend';
import { Button } from '@/components/ui/button';
import { pageStagger, pageItem } from '@/lib/motion';

export default function HandoverGuide({
    stages,
    can_access_sign_offs,
}: {
    stages: LegendStage[];
    can_access_sign_offs: boolean;
}) {
    return (
        <>
            <Head title="Handover guide" />
            <motion.div
                className="mx-auto flex w-full max-w-3xl flex-col gap-8 p-4 md:p-6"
                variants={pageStagger}
                initial="hidden"
                animate="visible"
            >
                {/* Page Header */}
                <motion.div
                    variants={pageItem}
                    className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-start sm:justify-between"
                >
                    <div>
                        <p className="mb-1 text-xs font-semibold tracking-widest text-primary uppercase">
                            How it works
                        </p>
                        <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                            PC Handover Guide
                        </h1>
                        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                            Every PC passes through three sequential sign-off
                            stages before it is marked{' '}
                            <strong className="font-medium text-foreground">
                                Complete
                            </strong>
                            .
                        </p>
                    </div>
                    {can_access_sign_offs && (
                        <Button asChild className="shrink-0 gap-2">
                            <Link href="/handover-sign-offs">
                                Sign-off queue
                                <ArrowRight className="size-4" />
                            </Link>
                        </Button>
                    )}
                </motion.div>

                {/* Vertical Stepper */}
                <motion.div variants={pageItem}>
                    <div className="relative">
                        {/* Connecting line */}
                        <div className="absolute top-10 left-[18px] h-[calc(100%-5rem)] w-px bg-border" />

                        <ol className="space-y-0">
                            {/* Start node */}
                            <li className="relative flex items-center gap-4 pb-8">
                                <div className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-border bg-background text-muted-foreground">
                                    <Pen className="size-3.5" strokeWidth={2} />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                        Registered
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        ICT Admin creates the PC record and the
                                        handover enters the pipeline.
                                    </p>
                                </div>
                            </li>

                            {/* Stage steps */}
                            {stages.map((stage, index) => (
                                <li
                                    key={stage.key}
                                    className="relative flex gap-4 pb-8"
                                >
                                    {/* Step number bubble */}
                                    <div className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background text-sm font-bold text-primary">
                                        {index + 1}
                                    </div>

                                    {/* Step content card */}
                                    <div className="flex-1 rounded-xl border border-border/60 bg-card p-4 shadow-sm">
                                        <div className="flex flex-wrap items-start justify-between gap-2">
                                            <div>
                                                <p className="font-semibold text-foreground">
                                                    {stage.label}
                                                </p>
                                                <p className="mt-0.5 text-sm text-muted-foreground">
                                                    {stage.description}
                                                </p>
                                            </div>
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/50 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                                <FileText className="size-3" />
                                                {stage.form_label}
                                            </span>
                                        </div>
                                        {stage.signer_role && (
                                            <div className="mt-3 flex items-center gap-2 border-t border-border/40 pt-3">
                                                <span className="text-xs text-muted-foreground">
                                                    Signed by
                                                </span>
                                                <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-semibold text-foreground">
                                                    {stage.signer_role}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </li>
                            ))}

                            {/* Complete node */}
                            <li className="relative flex items-center gap-4">
                                <div className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                                    <CheckCircle2
                                        className="size-4"
                                        strokeWidth={2.5}
                                    />
                                </div>
                                <div>
                                    <p className="font-semibold text-foreground">
                                        Complete
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        All stages signed. The record is
                                        archived.
                                    </p>
                                </div>
                            </li>
                        </ol>
                    </div>
                </motion.div>

                {/* Deletion policy note */}
                <motion.div
                    variants={pageItem}
                    className="flex gap-3 rounded-xl border border-border/60 bg-card p-5 shadow-sm"
                >
                    <AlertCircle
                        className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                        strokeWidth={1.75}
                    />
                    <div>
                        <h2 className="font-semibold text-foreground">
                            Who can delete a register record?
                        </h2>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                            Only{' '}
                            <strong className="font-medium text-foreground">
                                ICT Admin
                            </strong>{' '}
                            can delete a PC, and only while it is still{' '}
                            <strong className="font-medium text-foreground">
                                Pending
                            </strong>{' '}
                            with no forms signed yet. Once any stage is signed,
                            the record is locked and cannot be removed.
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </>
    );
}

HandoverGuide.layout = {
    title: 'Handover guide',
};
