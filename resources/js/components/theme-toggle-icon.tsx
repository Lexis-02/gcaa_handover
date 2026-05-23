import { Moon, Sun } from 'lucide-react';
import { HeaderIconButton } from '@/components/header-icon-button';
import { useAppearance } from '@/hooks/use-appearance';

type ThemeToggleIconProps = {
    className?: string;
};

export function ThemeToggleIcon({ className }: ThemeToggleIconProps) {
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';

    return (
        <HeaderIconButton
            icon={isDark ? Sun : Moon}
            label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className={className}
            onClick={() => updateAppearance(isDark ? 'light' : 'dark')}
        />
    );
}
