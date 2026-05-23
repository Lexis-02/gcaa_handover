import { Badge } from '@/components/ui/badge';
import type { RecentAsset } from '@/types';

const statusLabels: Record<string, string> = {
    pending: 'Pending',
    stage_1_complete: 'Stage 1',
    stage_2_complete: 'Stage 2',
    stage_3_complete: 'Stage 3',
    complete: 'Complete',
    faulty_on_arrival: 'Faulty',
    on_hold: 'On hold',
};

type RecentAssetsTableProps = {
    items: RecentAsset[];
    title?: string;
};

export function RecentAssetsTable({
    items,
    title = 'Recent PC activity',
}: RecentAssetsTableProps) {
    return (
        <div className="dashboard-card overflow-hidden rounded-2xl border border-border/60 bg-card">
            <div className="border-b border-border/60 px-6 py-4">
                <h3 className="text-base font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">
                    Latest updates across your scope
                </p>
            </div>
            {items.length === 0 ? (
                <div className="px-6 py-12 text-center text-sm text-muted-foreground">
                    No PC assets yet. Seed data or create a batch to get
                    started.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border/60 bg-muted/40 text-left text-muted-foreground">
                                <th className="px-6 py-3 font-medium">Ref</th>
                                <th className="px-6 py-3 font-medium">Model</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                                <th className="hidden px-6 py-3 font-medium md:table-cell">
                                    Department
                                </th>
                                <th className="px-6 py-3 font-medium">Updated</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr
                                    key={item.id}
                                    className="border-b border-border/40 last:border-0"
                                >
                                    <td className="px-6 py-3 font-mono text-xs font-medium">
                                        {item.id}
                                    </td>
                                    <td className="px-6 py-3">{item.name}</td>
                                    <td className="px-6 py-3">
                                        <Badge
                                            variant="secondary"
                                            className="font-normal"
                                        >
                                            {statusLabels[item.status] ??
                                                item.status}
                                        </Badge>
                                    </td>
                                    <td className="hidden px-6 py-3 text-muted-foreground md:table-cell">
                                        {item.department ?? '—'}
                                    </td>
                                    <td className="px-6 py-3 text-muted-foreground">
                                        {item.updated_at ?? '—'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
