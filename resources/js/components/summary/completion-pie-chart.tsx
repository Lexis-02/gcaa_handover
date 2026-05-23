import { motion } from 'framer-motion';
import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';
import { chartColors } from '@/lib/chart-theme';
import {
    SummaryChartTooltip,
    SummaryLegend,
} from '@/components/summary/summary-chart-tooltip';

type SplitPoint = {
    name: string;
    value: number;
    fill?: string;
};

function resolveFill(name: string): string {
    return (
        chartColors.status[name as keyof typeof chartColors.status] ??
        chartColors.muted
    );
}

export function CompletionPieChart({ data }: { data: SplitPoint[] }) {
    const enriched = data.map((entry) => ({
        ...entry,
        fill:
            entry.fill && !entry.fill.startsWith('hsl')
                ? entry.fill
                : resolveFill(entry.name),
    }));

    const total = enriched.reduce((sum, item) => sum + item.value, 0);

    if (total === 0) {
        return (
            <div className="flex h-72 items-center justify-center text-sm text-muted-foreground">
                No PCs registered yet for this view.
            </div>
        );
    }

    return (
        <motion.div
            className="h-72 w-full"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={enriched}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="44%"
                        innerRadius={58}
                        outerRadius={86}
                        paddingAngle={3}
                        animationDuration={800}
                        animationEasing="ease-out"
                        stroke={chartColors.card}
                        strokeWidth={2}
                    >
                        {enriched.map((entry) => (
                            <Cell key={entry.name} fill={entry.fill} />
                        ))}
                    </Pie>
                    <Tooltip content={<SummaryChartTooltip />} />
                    <Legend
                        verticalAlign="bottom"
                        content={(props) => (
                            <SummaryLegend payload={props.payload} />
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>
        </motion.div>
    );
}
