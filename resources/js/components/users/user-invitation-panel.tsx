import { Form, router } from '@inertiajs/react';
import { Check, Copy, Link2, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { confirmAction } from '@/lib/sweetalert';
import { cn } from '@/lib/utils';

type InvitationRecord = {
    id: string;
    role: string;
    role_label: string;
    label: string | null;
    department: { id: number; name: string } | null;
    expires_at: string;
    expires_human: string;
    used_at: string | null;
    status: 'active' | 'used' | 'expired';
    created_by: { id: number; name: string } | null;
    registered_user: { id: number; name: string; username: string } | null;
    registration_url: string | null;
};

type InvitationOptions = {
    roles: string[];
    role_labels: Record<string, string>;
    departments: { id: number; name: string }[];
    invitation_expiry_days: number;
};

const selectClassName = cn(
    'h-10 w-full rounded-lg border border-border/60 bg-background px-3 text-sm',
    'outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15',
);

function statusBadge(status: InvitationRecord['status']) {
    switch (status) {
        case 'active':
            return 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300';
        case 'used':
            return 'bg-primary/10 text-primary';
        default:
            return 'bg-muted text-muted-foreground';
    }
}

export function UserInvitationPanel({
    invitations,
    options,
    flashLink,
    embedded = false,
}: {
    invitations: InvitationRecord[];
    options: InvitationOptions;
    flashLink?: string | null;
    /** When true, page hero already shows title — hide duplicate panel header */
    embedded?: boolean;
}) {
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [generatedLink, setGeneratedLink] = useState<string | null>(
        flashLink ?? null,
    );

    useEffect(() => {
        if (flashLink) {
            setGeneratedLink(flashLink);
        }
    }, [flashLink]);

    const copyLink = async (url: string, id?: string) => {
        await navigator.clipboard.writeText(url);
        setCopiedId(id ?? 'new');
        window.setTimeout(() => setCopiedId(null), 2000);
    };

    const revokeInvitation = async (invitation: InvitationRecord) => {
        const confirmed = await confirmAction({
            title: 'Revoke invitation?',
            text: 'This registration link will stop working immediately.',
            confirmText: 'Revoke',
            icon: 'warning',
        });
        if (!confirmed) return;
        router.delete(`/users/invitations/${invitation.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <section className="rounded-xl bg-card shadow-sm ring-1 ring-border/60">
            {!embedded && (
                <div className="border-b border-border/60 px-4 py-4 md:px-5">
                    <div className="flex items-start gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Link2 className="size-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold">
                                Registration links
                            </h2>
                            <p className="mt-0.5 text-sm text-muted-foreground">
                                Generate a signed, one-time link for
                                self-registration. Links expire after{' '}
                                {options.invitation_expiry_days} days.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-4 p-4 md:p-5">
                <Form
                    action="/users/invitations"
                    method="post"
                    className="grid gap-4 rounded-lg border border-dashed border-border/60 bg-muted/20 p-4 sm:grid-cols-2 lg:grid-cols-4"
                >
                    {({ processing }) => (
                        <>
                            <div className="space-y-2 sm:col-span-1">
                                <Label htmlFor="inv_role">Role</Label>
                                <select
                                    id="inv_role"
                                    name="role"
                                    required
                                    className={selectClassName}
                                    defaultValue="end_user"
                                >
                                    {options.roles.map((role) => (
                                        <option key={role} value={role}>
                                            {options.role_labels[role] ??
                                                role}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2 sm:col-span-1">
                                <Label htmlFor="inv_department">
                                    Department (optional)
                                </Label>
                                <select
                                    id="inv_department"
                                    name="department_id"
                                    className={selectClassName}
                                    defaultValue=""
                                >
                                    <option value="">Any / none</option>
                                    {options.departments.map((d) => (
                                        <option key={d.id} value={d.id}>
                                            {d.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2 sm:col-span-1">
                                <Label htmlFor="inv_label">
                                    Note (optional)
                                </Label>
                                <input
                                    id="inv_label"
                                    name="label"
                                    type="text"
                                    maxLength={120}
                                    placeholder="e.g. HR director"
                                    className={selectClassName}
                                />
                            </div>
                            <div className="flex items-end sm:col-span-1">
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={processing}
                                >
                                    Generate link
                                </Button>
                            </div>
                        </>
                    )}
                </Form>

                {generatedLink && (
                    <div className="flex flex-col gap-2 rounded-lg border border-primary/25 bg-primary/5 p-3 sm:flex-row sm:items-center">
                        <p className="min-w-0 flex-1 break-all font-mono text-xs text-foreground">
                            {generatedLink}
                        </p>
                        <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            className="shrink-0 gap-2"
                            onClick={() => copyLink(generatedLink, 'new')}
                        >
                            {copiedId === 'new' ? (
                                <Check className="size-4" />
                            ) : (
                                <Copy className="size-4" />
                            )}
                            {copiedId === 'new' ? 'Copied' : 'Copy link'}
                        </Button>
                    </div>
                )}

                {invitations.length > 0 ? (
                    <div className="custom-scrollbar overflow-x-auto">
                        <table className="w-full border-collapse text-sm">
                            <thead>
                                <tr className="border-b text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    <th className="py-2 pr-3">Role</th>
                                    <th className="py-2 pr-3">Department</th>
                                    <th className="py-2 pr-3">Status</th>
                                    <th className="py-2 pr-3">Expires</th>
                                    <th className="py-2 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invitations.map((row) => (
                                    <tr
                                        key={row.id}
                                        className="border-b border-border/40"
                                    >
                                        <td className="py-2.5 pr-3">
                                            <span className="font-medium">
                                                {row.role_label}
                                            </span>
                                            {row.label && (
                                                <p className="text-xs text-muted-foreground">
                                                    {row.label}
                                                </p>
                                            )}
                                        </td>
                                        <td className="py-2.5 pr-3 text-muted-foreground">
                                            {row.department?.name ?? '—'}
                                        </td>
                                        <td className="py-2.5 pr-3">
                                            <span
                                                className={cn(
                                                    'inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize',
                                                    statusBadge(row.status),
                                                )}
                                            >
                                                {row.status}
                                            </span>
                                            {row.registered_user && (
                                                <p className="mt-0.5 text-xs text-muted-foreground">
                                                    → {row.registered_user.name}
                                                </p>
                                            )}
                                        </td>
                                        <td className="py-2.5 pr-3 text-muted-foreground">
                                            {row.expires_human}
                                        </td>
                                        <td className="py-2.5 text-right">
                                            <div className="flex justify-end gap-1">
                                                {row.registration_url && (
                                                    <Button
                                                        type="button"
                                                        size="icon"
                                                        variant="ghost"
                                                        className="size-8"
                                                        title="Copy link"
                                                        onClick={() =>
                                                            copyLink(
                                                                row.registration_url!,
                                                                row.id,
                                                            )
                                                        }
                                                    >
                                                        {copiedId ===
                                                        row.id ? (
                                                            <Check className="size-4" />
                                                        ) : (
                                                            <Copy className="size-4" />
                                                        )}
                                                    </Button>
                                                )}
                                                {row.status === 'active' && (
                                                    <Button
                                                        type="button"
                                                        size="icon"
                                                        variant="ghost"
                                                        className="size-8 text-destructive hover:text-destructive"
                                                        title="Revoke"
                                                        onClick={() =>
                                                            revokeInvitation(
                                                                row,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-sm text-muted-foreground py-4">
                        No invitations yet. Generate a link above.
                    </p>
                )}
            </div>
        </section>
    );
}
