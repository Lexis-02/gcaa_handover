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

type DepartmentRow = {
    short_name: string;
    name: string;
    assigned: number;
    completed: number;
    in_progress: number;
    percent_complete: number;
};

export function DepartmentAssignedChart({ data }: { data: DepartmentRow[] }) {
    const chartData = data.filter((row) => row.assigned > 0);

    if (chartData.length === 0) {
        return (
            <div className="flex h-80 items-center justify-center text-sm text-muted-foreground">
                No department assignments yet.
            </div>
        );
    }

    return (
        <motion.div
            className="h-80 w-full"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
        >
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 4, right: 16, left: 4, bottom: 4 }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={chartGridStroke}
                        horizontal={false}
                    />
                    <XAxis
                        type="number"
                        allowDecimals={false}
                        tick={chartAxisTick}
                        axisLine={{ stroke: chartGridStroke }}
                    />
                    <YAxis
                        type="category"
                        dataKey="short_name"
                        width={76}
                        tick={{
                            fontSize: 10,
                            fill: chartColors.mutedForeground,
                        }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        cursor={{ fill: barCursorFill }}
                        content={<SummaryChartTooltip labelKey="name" />}
                    />
                    <Legend
                        content={(props) => (
                            <SummaryLegend payload={props.payload} />
                        )}
                    />
                    <Bar
                        dataKey="completed"
                        name="Completed"
                        stackId="a"
                        fill={chartColors.department.completed}
                        radius={[0, 0, 0, 0]}
                        animationDuration={650}
                        activeBar={{ filter: 'brightness(1.1)' }}
                    />
                    <Bar
                        dataKey="in_progress"
                        name="In progress"
                        stackId="a"
                        fill={chartColors.department.inProgress}
                        radius={[0, 6, 6, 0]}
                        animationDuration={650}
                        activeBar={{ filter: 'brightness(1.1)' }}
                    />
                </BarChart>
            </ResponsiveContainer>
        </motion.div>
    );
}

export function DepartmentPercentChart({ data }: { data: DepartmentRow[] }) {
    const chartData = [...data]
        .filter((row) => row.assigned > 0)
        .sort((a, b) => b.percent_complete - a.percent_complete)
        .slice(0, 10);

    if (chartData.length === 0) {
        return (
            <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
                No completion data yet.
            </div>
        );
    }

    return (
        <motion.div
            className="h-64 w-full"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.06 }}
        >
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={chartData}
                    margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={chartGridStroke}
                        vertical={false}
                    />
                    <XAxis
                        dataKey="short_name"
                        tick={{
                            fontSize: 10,
                            fill: chartColors.mutedForeground,
                        }}
                        interval={0}
                        angle={-32}
                        textAnchor="end"
                        height={64}
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
                        content={<SummaryChartTooltip labelKey="name" />}
                        formatter={(value) => [
                            `${Number(value ?? 0).toFixed(1)}%`,
                            'Complete',
                        ]}
                    />
                    <Bar
                        dataKey="percent_complete"
                        name="% Complete"
                        fill={chartColors.department.percent}
                        radius={[8, 8, 0, 0]}
                        maxBarSize={40}
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
