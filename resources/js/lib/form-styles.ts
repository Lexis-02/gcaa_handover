import { cn } from '@/lib/utils';

/**
 * Shared design tokens for all native form elements (select, textarea, etc.)
 * Matches the polished FormInput component style.
 */
export const selectCn = cn(
    // Layout
    'h-11 w-full rounded-xl border px-3 text-sm outline-none',
    // Typography & background
    'bg-background/80 text-foreground',
    // Default border + hover
    'border-border/60 hover:border-border',
    // Focus ring — matches FormInput primary accent
    'focus:border-primary/60 focus:bg-background focus:ring-4 focus:ring-primary/[0.08]',
    // Transitions
    'transition-all duration-200 ease-in-out',
    // Disabled
    'disabled:cursor-not-allowed disabled:bg-muted/30 disabled:opacity-50',
    // Placeholder / option colour
    'placeholder:text-muted-foreground/50',
);

export const textareaCn = cn(
    selectCn,
    'h-auto min-h-[6rem] resize-y py-3 leading-relaxed',
);

export const formLabelCn = cn(
    'text-[13px] font-semibold tracking-wide text-foreground/80 select-none',
);

export const checkboxCn = cn(
    'size-4 cursor-pointer rounded border-border/60 accent-primary',
    'transition-all duration-150',
);
