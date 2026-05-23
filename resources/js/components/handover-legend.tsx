export type LegendStage = {
    key: string;
    label: string;
    description: string;
    form_label: string;
    signer_role: string | null;
};

export function HandoverLegend({
    stages,
    variant = 'compact',
}: {
    stages: LegendStage[];
    variant?: 'compact' | 'guide';
}) {
    const isGuide = variant === 'guide';

    return (
        <div
            className={
                isGuide
                    ? 'overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm'
                    : 'rounded-xl border border-border/60 bg-muted/20 p-4 text-sm'
            }
        >
            {!isGuide && (
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Handover legend — who signs before Complete
                </p>
            )}
            {isGuide && (
                <div className="border-b border-border/60 bg-primary/5 px-5 py-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                        Stages &amp; signatories
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Who must sign before the handover is approved as
                        Complete
                    </p>
                </div>
            )}
            <div className={isGuide ? 'overflow-x-auto p-1' : 'overflow-x-auto'}>
                <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                    <thead>
                        <tr
                            className={
                                isGuide
                                    ? 'bg-muted/40 text-xs font-semibold uppercase tracking-wide text-muted-foreground'
                                    : 'border-b border-border/60 text-xs text-muted-foreground'
                            }
                        >
                            <th className="px-4 py-3 font-medium">Stage</th>
                            <th className="px-4 py-3 font-medium">Action</th>
                            <th className="px-4 py-3 font-medium">Form</th>
                            <th className="px-4 py-3 font-medium">Signed by</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stages.map((stage) => (
                            <tr
                                key={stage.key}
                                className="border-b border-border/40 last:border-0 hover:bg-muted/20"
                            >
                                <td className="px-4 py-3.5 font-semibold text-foreground">
                                    {stage.label}
                                </td>
                                <td className="px-4 py-3.5 text-muted-foreground">
                                    {stage.description}
                                </td>
                                <td className="px-4 py-3.5 text-muted-foreground">
                                    {stage.form_label}
                                </td>
                                <td className="px-4 py-3.5 font-medium text-foreground">
                                    {stage.signer_role ?? '—'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
