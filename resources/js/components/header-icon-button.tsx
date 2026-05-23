import type { LucideIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

type HeaderIconButtonProps = ComponentProps<'button'> & {
    icon: LucideIcon;
    label: string;
    showDot?: boolean;
};

export function HeaderIconButton({
    icon: Icon,
    label,
    showDot = false,
    className,
    ...props
}: HeaderIconButtonProps) {
    return (
        <button
            type="button"
            aria-label={label}
            className={cn(
                'relative flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors',
                'hover:bg-muted/80 hover:text-foreground',
                'focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none',
                className,
            )}
            {...props}
        >
            <Icon className="size-[18px]" strokeWidth={1.75} />
            {showDot && (
                <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary ring-2 ring-card" />
            )}
        </button>
    );
}
