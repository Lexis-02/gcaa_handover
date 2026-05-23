type CompletionGaugeProps = {
    rate: number;
    label?: string;
};

export function CompletionGauge({
    rate,
    label = 'Completion rate',
}: CompletionGaugeProps) {
    const clamped = Math.min(100, Math.max(0, rate));
    const circumference = 2 * Math.PI * 42;
    const offset = circumference - (clamped / 100) * circumference;

    return (
        <div className="dashboard-card flex h-full flex-col items-center justify-center rounded-2xl border border-border/60 bg-card p-6">
            <h3 className="mb-4 self-start text-base font-semibold">{label}</h3>
            <div className="relative size-40">
                <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="10"
                        className="text-muted"
                    />
                    <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        className="text-primary transition-all duration-700"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">{clamped}%</span>
                    <span className="text-xs text-muted-foreground">
                        handovers done
                    </span>
                </div>
            </div>
        </div>
    );
}
