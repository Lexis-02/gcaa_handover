import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';

type ThemeToggleIconProps = {
    className?: string;
};

export function ThemeToggleIcon({ className }: ThemeToggleIconProps) {
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';

    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn('size-9 rounded-lg text-muted-foreground', className)}
            onClick={() => updateAppearance(isDark ? 'light' : 'dark')}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {isDark ? (
                <Sun className="size-[18px]" />
            ) : (
                <Moon className="size-[18px]" />
            )}
        </Button>
    );
}
