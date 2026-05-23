import { motion } from 'framer-motion';
import { chartColors } from '@/lib/chart-theme';
import { cn } from '@/lib/utils';

type PayloadItem = {
    name?: string;
    value?: number | string;
    color?: string;
    dataKey?: string | number;
    payload?: Record<string, unknown>;
};

type SummaryChartTooltipProps = {
    active?: boolean;
    payload?: PayloadItem[];
    label?: string | number;
    labelKey?: string;
};

export function SummaryChartTooltip({
    active,
    payload,
    label,
    labelKey = 'name',
}: SummaryChartTooltipProps) {
    if (!active || !payload?.length) {
        return null;
    }

    const title =
        (typeof label === 'string' && label) ||
        (payload[0]?.payload?.[labelKey] as string | undefined) ||
        (payload[0]?.payload?.name as string | undefined);

    return (
        <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
            className={cn(
                'min-w-[10rem] rounded-xl border border-border/80',
                'bg-card/95 px-3.5 py-2.5 shadow-lg backdrop-blur-md',
            )}
        >
            {title && (
                <p className="mb-2 border-b border-border/50 pb-1.5 text-xs font-semibold text-foreground">
                    {title}
                </p>
            )}
            <ul className="space-y-1.5">
                {(payload as PayloadItem[]).map((item) => {
                    const color =
                        item.color ??
                        (item.payload?.fill as string) ??
                        chartColors.primary;
                    const name = item.name ?? String(item.dataKey ?? '');
                    const raw = item.value;
                    let display = String(raw ?? '—');
                    if (typeof raw === 'number') {
                        display = Number.isInteger(raw)
                            ? String(raw)
                            : raw.toFixed(1);
                        if (
                            name.includes('%') ||
                            name === 'Complete' &&
                                typeof label === 'string' &&
                                label.includes('%')
                        ) {
                            display = `${display}%`;
                        }
                    }

                    return (
                        <li
                            key={`${name}-${display}`}
                            className="flex items-center justify-between gap-4 text-xs"
                        >
                            <span className="flex items-center gap-2 text-muted-foreground">
                                <span
                                    className="size-2.5 shrink-0 rounded-full ring-1 ring-black/5"
                                    style={{ backgroundColor: color }}
                                />
                                {name}
                            </span>
                            <span className="font-mono font-semibold tabular-nums text-foreground">
                                {display}
                            </span>
                        </li>
                    );
                })}
            </ul>
        </motion.div>
    );
}

export function SummaryLegend({
    payload,
}: {
    payload?: readonly { value?: string; color?: string }[];
}) {
    if (!payload?.length) {
        return null;
    }

    return (
        <ul className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1.5">
            {payload.map((entry) => (
                <li
                    key={entry.value}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                    <span
                        className="size-2.5 rounded-sm ring-1 ring-black/5"
                        style={{
                            backgroundColor:
                                entry.color ?? chartColors.primary,
                        }}
                    />
                    <span>{entry.value}</span>
                </li>
            ))}
        </ul>
    );
}
