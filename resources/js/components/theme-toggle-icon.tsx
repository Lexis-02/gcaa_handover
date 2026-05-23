import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { HeaderIconButton } from '@/components/header-icon-button';
import { useAppearance } from '@/hooks/use-appearance';

type ThemeToggleIconProps = {
    className?: string;
};

/**
 * Theme icon/label depend on localStorage and system preference, which are
 * unavailable during SSR — render a stable placeholder until mounted.
 */
export function ThemeToggleIcon({ className }: ThemeToggleIconProps) {
    const [mounted, setMounted] = useState(false);
    const { resolvedAppearance, updateAppearance } = useAppearance();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <HeaderIconButton
                icon={Moon}
                label="Toggle color theme"
                className={className}
                disabled
            />
        );
    }

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
