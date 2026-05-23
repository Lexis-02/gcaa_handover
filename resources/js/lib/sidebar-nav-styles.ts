import { cn } from '@/lib/utils';

/** Active/hover styles for sky-blue sidebar (#0393D9) */
export const sidebarLinkBase = cn(
    'h-11 gap-3 px-4 py-3 text-[15px] font-medium',
    'text-sidebar-foreground/90 hover:bg-white/[0.12] hover:text-sidebar-foreground',
);

export const sidebarLinkActive = cn(
    'bg-[var(--sidebar-active-bg)] text-sidebar-foreground',
    'ring-1 ring-inset ring-white/15',
    'border-l-[3px] border-l-[var(--sidebar-active-border)]',
    'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]',
);

export const sidebarSubLinkBase = cn(
    'h-10 gap-3 px-4 py-2.5 text-sm font-medium',
    'text-sidebar-foreground/80 hover:bg-white/[0.1] hover:text-sidebar-foreground',
);

export const sidebarSubLinkActive = cn(
    'bg-white/[0.12] text-sidebar-foreground',
    'border-l-2 border-l-white/70',
);

export const sidebarParentOpen = cn(
    'bg-white/[0.08] text-sidebar-foreground',
    'ring-1 ring-inset ring-white/10',
);

export const sidebarParentActive = cn(
    sidebarLinkActive,
    'data-[state=open]:bg-[var(--sidebar-active-bg)]',
);
