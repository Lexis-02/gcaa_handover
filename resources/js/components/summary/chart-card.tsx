import { motion } from 'framer-motion';
import { pageItem } from '@/lib/motion';
import { cn } from '@/lib/utils';

type ChartCardProps = {
    title: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
    index?: number;
};

export function ChartCard({
    title,
    description,
    children,
    className,
    index = 0,
}: ChartCardProps) {
    return (
        <motion.section
            variants={pageItem}
            transition={{ delay: index * 0.07 }}
            className={cn(
                'rounded-xl border border-border/60 bg-card p-4 shadow-sm md:p-5',
                className,
            )}
        >
            <div className="mb-4">
                <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
                {description && (
                    <p className="mt-1 text-xs text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>
            {children}
        </motion.section>
    );
}
