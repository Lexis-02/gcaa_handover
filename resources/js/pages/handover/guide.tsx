import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { HandoverLegend, type LegendStage } from '@/components/handover-legend';
import { Button } from '@/components/ui/button';
import { pageEnter } from '@/lib/motion';

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
                className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-4 md:p-6"
                variants={pageEnter}
                initial="hidden"
                animate="visible"
            >
                <div className="space-y-2">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        PC handover guide
                    </h1>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                        Each PC moves through three sign-off stages before it
                        is marked <strong className="text-foreground">Complete</strong>.
                        Use <strong className="text-foreground">Register → Sign-offs</strong>{' '}
                        to action PCs waiting for your signature.
                    </p>
                </div>

                <HandoverLegend stages={stages} variant="guide" />

                <div className="rounded-xl border border-border/60 bg-card p-5 text-sm shadow-sm">
                    <h2 className="font-semibold">Who can delete a register record?</h2>
                    <p className="mt-2 text-muted-foreground">
                        Only <strong className="text-foreground">ICT Admin</strong>{' '}
                        can delete a PC, and only while it is still{' '}
                        <strong className="text-foreground">Pending</strong> with
                        no forms signed yet.
                    </p>
                </div>

                {can_access_sign_offs && (
                    <Button asChild variant="outline" className="w-fit">
                        <Link href="/handover-sign-offs">
                            Open sign-off queue
                        </Link>
                    </Button>
                )}
            </motion.div>
        </>
    );
}

HandoverGuide.layout = {
    title: 'Handover guide',
};
