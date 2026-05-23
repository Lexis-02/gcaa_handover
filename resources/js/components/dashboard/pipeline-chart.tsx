import { cn } from '@/lib/utils';
import type { PipelineSegment } from '@/types';

type PipelineChartProps = {
    segments: PipelineSegment[];
    completionRate: number;
};

const colorClass: Record<string, string> = {
    'chart-1': 'bg-chart-1',
    'chart-2': 'bg-chart-2',
    'chart-3': 'bg-chart-3',
    'chart-4': 'bg-chart-4',
    'chart-5': 'bg-chart-5',
};

export function PipelineChart({
    segments,
    completionRate,
}: PipelineChartProps) {
    const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;

    return (
        <div className="dashboard-card flex h-full flex-col rounded-2xl border border-border/60 bg-card p-6">
            <div className="mb-6 flex items-start justify-between">
                <div>
                    <h3 className="text-base font-semibold">Handover pipeline</h3>
                    <p className="text-sm text-muted-foreground">
                        PCs by current stage
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                        {completionRate}%
                    </p>
                    <p className="text-xs text-muted-foreground">Complete</p>
                </div>
            </div>

            <div className="mb-6 flex h-3 overflow-hidden rounded-full bg-muted">
                {segments.map((segment) => (
                    <div
                        key={segment.label}
                        className={cn(
                            'h-full transition-all',
                            colorClass[segment.color] ?? 'bg-primary',
                        )}
                        style={{
                            width: `${(segment.value / total) * 100}%`,
                        }}
                        title={`${segment.label}: ${segment.value}`}
                    />
                ))}
            </div>

            <ul className="mt-auto grid gap-3 sm:grid-cols-2">
                {segments.map((segment) => (
                    <li
                        key={segment.label}
                        className="flex items-center justify-between gap-2 text-sm"
                    >
                        <span className="flex items-center gap-2">
                            <span
                                className={cn(
                                    'size-2.5 rounded-full',
                                    colorClass[segment.color] ?? 'bg-primary',
                                )}
                            />
                            {segment.label}
                        </span>
                        <span className="font-semibold tabular-nums">
                            {segment.value}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
