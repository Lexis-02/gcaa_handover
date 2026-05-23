import { cn } from '@/lib/utils';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const heights = [45, 82, 58, 70, 65, 30, 25];

export function WeeklyActivity() {
    const max = Math.max(...heights);

    return (
        <div className="dashboard-card flex h-full flex-col rounded-2xl border border-border/60 bg-card p-6">
            <h3 className="text-base font-semibold">Weekly activity</h3>
            <p className="mb-6 text-sm text-muted-foreground">
                Handover actions by day
            </p>
            <div className="flex flex-1 items-end justify-between gap-2">
                {days.map((day, i) => (
                    <div
                        key={day}
                        className="flex flex-1 flex-col items-center gap-2"
                    >
                        <div
                            className={cn(
                                'w-full max-w-8 rounded-t-lg transition-all',
                                i === 1 ? 'bg-primary' : 'bg-muted',
                            )}
                            style={{
                                height: `${(heights[i] / max) * 120}px`,
                            }}
                        />
                        <span
                            className={cn(
                                'text-xs',
                                i === 1
                                    ? 'font-semibold text-primary'
                                    : 'text-muted-foreground',
                            )}
                        >
                            {day}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
