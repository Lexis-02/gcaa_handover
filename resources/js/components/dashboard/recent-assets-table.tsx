import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { pageItem } from '@/lib/motion';
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
    showViewAll?: boolean;
};

export function RecentAssetsTable({
    items,
    title = 'Recent PC activity',
    showViewAll = true,
}: RecentAssetsTableProps) {
    return (
        <motion.div
            variants={pageItem}
            className="overflow-hidden rounded-2xl border border-border/60 bg-card"
        >
            <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
                <div>
                    <h3 className="text-base font-semibold">{title}</h3>
                    <p className="text-sm text-muted-foreground">
                        Latest updates in your scope
                    </p>
                </div>
                {showViewAll && (
                    <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="rounded-xl"
                    >
                        <Link href="/pc-register">View all</Link>
                    </Button>
                )}
            </div>
            {items.length === 0 ? (
                <div className="px-6 py-12 text-center text-sm text-muted-foreground">
                    No PC assets in your scope yet.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border/60 bg-muted/40 text-left text-muted-foreground">
                                <th className="px-6 py-3 font-medium">Ref</th>
                                <th className="px-6 py-3 font-medium">Model</th>
                                <th className="px-6 py-3 font-medium">
                                    Status
                                </th>
                                <th className="hidden px-6 py-3 font-medium md:table-cell">
                                    Department
                                </th>
                                <th className="px-6 py-3 font-medium">
                                    Updated
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <motion.tr
                                    key={item.id}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        delay: 0.1 + index * 0.05,
                                        duration: 0.3,
                                    }}
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
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </motion.div>
    );
}
