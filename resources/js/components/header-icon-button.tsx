import type { LucideIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type HeaderIconButtonProps = ComponentProps<typeof Button> & {
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
        <Button
            variant="ghost"
            size="icon"
            aria-label={label}
            className={cn(
                'relative size-9 text-muted-foreground hover:bg-muted/80',
                className,
            )}
            {...props}
        >
            <Icon className="size-[18px]" strokeWidth={1.75} />
            {showDot && (
                <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary ring-2 ring-card" />
            )}
        </Button>
    );
}
