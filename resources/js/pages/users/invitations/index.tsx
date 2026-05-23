import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Link2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserInvitationPanel } from '@/components/users/user-invitation-panel';
import { pageEnter } from '@/lib/motion';

type PageProps = {
    invitations: Parameters<typeof UserInvitationPanel>[0]['invitations'];
    options: Parameters<typeof UserInvitationPanel>[0]['options'];
    flash_invitation_link?: string | null;
};

export default function UsersInvitationsIndex({
    invitations,
    options,
    flash_invitation_link,
}: PageProps) {
    return (
        <>
            <Head title="Registration links" />
            <motion.div
                className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-4 md:p-6"
                variants={pageEnter}
                initial="hidden"
                animate="visible"
            >
                <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-5 shadow-sm md:p-6">
                    <div className="pointer-events-none absolute -top-10 -right-10 size-40 rounded-full bg-primary/10 blur-2xl" />
                    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex gap-4">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                                <Link2 className="size-6" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold tracking-tight">
                                    Registration links
                                </h2>
                                <p className="mt-1 max-w-lg text-sm text-muted-foreground">
                                    Generate signed, one-time links so new staff
                                    can self-register. Links expire after{' '}
                                    {options.invitation_expiry_days} days.
                                </p>
                            </div>
                        </div>
                        <Button asChild size="sm" variant="outline">
                            <Link href="/users">
                                <Users className="size-4" />
                                User accounts
                            </Link>
                        </Button>
                    </div>
                </div>

                <UserInvitationPanel
                    invitations={invitations}
                    options={options}
                    flashLink={flash_invitation_link}
                    embedded
                />
            </motion.div>
        </>
    );
}

UsersInvitationsIndex.layout = { title: 'Registration links' };
