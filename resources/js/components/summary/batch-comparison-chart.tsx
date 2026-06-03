import { motion } from 'framer-motion';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
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
import {
    SummaryChartTooltip,
    SummaryLegend,
} from '@/components/summary/summary-chart-tooltip';

type BatchComparison = {
    id: number;
    label: string;
    batch_code: string;
    total_pcs: number;
    registered: number;
    complete: number;
    percent_complete: number;
};

const SERIES = [
    {
        key: 'total_pcs',
        name: 'Batch size',
        fill: chartColors.batch.size,
    },
    {
        key: 'registered',
        name: 'Registered',
        fill: chartColors.batch.registered,
    },
    {
        key: 'complete',
        name: 'Complete',
        fill: chartColors.batch.complete,
    },
] as const;

export function BatchComparisonChart({ data }: { data: BatchComparison[] }) {
    if (data.length === 0) {
        return (
            <div className="flex h-80 items-center justify-center text-sm text-muted-foreground">
                No batches created yet.
            </div>
        );
    }

    return (
        <motion.div
            className="h-80 w-full"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
        >
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
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
                        axisLine={{ stroke: chartGridStroke }}
                    />
                    <YAxis
                        allowDecimals={false}
                        tick={chartAxisTick}
                        axisLine={false}
                    />
                    <Tooltip
                        cursor={{ fill: barCursorFill }}
                        content={<SummaryChartTooltip labelKey="batch_code" />}
                    />
                    <Legend
                        content={(props) => (
                            <SummaryLegend payload={props.payload} />
                        )}
                    />
                    {SERIES.map((series) => (
                        <Bar
                            key={series.key}
                            dataKey={series.key}
                            name={series.name}
                            fill={series.fill}
                            radius={[6, 6, 0, 0]}
                            maxBarSize={28}
                            animationDuration={700}
                            animationEasing="ease-out"
                            activeBar={{
                                stroke: series.fill,
                                strokeWidth: 2,
                                opacity: 0.92,
                            }}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </motion.div>
    );
}

export function BatchPercentChart({ data }: { data: BatchComparison[] }) {
    if (data.length === 0) {
        return null;
    }

    return (
        <motion.div
            className="h-64 w-full"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
        >
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
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
                        axisLine={{ stroke: chartGridStroke }}
                    />
                    <YAxis
                        domain={[0, 100]}
                        tickFormatter={(v) => `${v}%`}
                        tick={chartAxisTick}
                        axisLine={false}
                    />
                    <Tooltip
                        cursor={{ fill: barCursorFill }}
                        content={<SummaryChartTooltip labelKey="batch_code" />}
                        formatter={(value) => [
                            `${Number(value ?? 0).toFixed(1)}%`,
                            '% Complete',
                        ]}
                    />
                    <Bar
                        dataKey="percent_complete"
                        name="% Complete"
                        fill={chartColors.batch.percent}
                        radius={[8, 8, 0, 0]}
                        maxBarSize={48}
                        animationDuration={700}
                        animationEasing="ease-out"
                        activeBar={{
                            fill: chartColors.primary,
                            stroke: chartColors.primary,
                            strokeWidth: 2,
                        }}
                    />
                </BarChart>
            </ResponsiveContainer>
        </motion.div>
    );
}
