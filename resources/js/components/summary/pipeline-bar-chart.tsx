import { motion } from 'framer-motion';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import {
    barCursorFill,
    chartAxisTick,
    chartColors,
    chartGridStroke,
} from '@/lib/chart-theme';
import { SummaryChartTooltip } from '@/components/summary/summary-chart-tooltip';

type PipelinePoint = {
    label: string;
    count: number;
    fill?: string;
};

function resolveFill(label: string): string {
    return (
        chartColors.pipeline[label as keyof typeof chartColors.pipeline] ??
        chartColors.primary
    );
}

export function PipelineBarChart({ data }: { data: PipelinePoint[] }) {
    const enriched = data.map((entry) => ({
        ...entry,
        fill: resolveFill(entry.label),
    }));

    return (
        <motion.div
            className="h-72 w-full"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
        >
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={enriched}
                    margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={chartGridStroke}
                        vertical={false}
                    />
                    <XAxis
                        dataKey="label"
                        tick={chartAxisTick}
                        tickLine={false}
                        axisLine={{ stroke: chartGridStroke }}
                    />
                    <YAxis
                        allowDecimals={false}
                        tick={chartAxisTick}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip
                        cursor={{ fill: barCursorFill }}
                        content={<SummaryChartTooltip labelKey="label" />}
                    />
                    <Bar
                        dataKey="count"
                        radius={[8, 8, 0, 0]}
                        maxBarSize={52}
                        animationDuration={700}
                        animationEasing="ease-out"
                        activeBar={{
                            stroke: chartColors.primary,
                            strokeWidth: 2,
                            filter: 'brightness(1.08)',
                        }}
                    >
                        {enriched.map((entry) => (
                            <Cell key={entry.label} fill={entry.fill} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </motion.div>
    );
}
