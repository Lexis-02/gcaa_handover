import { cn } from '@/lib/utils';

/** Active/hover styles for sky-blue sidebar (#0393D9) */
export const sidebarLinkBase = cn(
    'h-10 gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium',
    'text-sidebar-foreground/80 hover:bg-white/[0.1] hover:text-sidebar-foreground',
    'transition-all duration-150',
);

export const sidebarLinkActive = cn(
    'bg-white/[0.16] text-sidebar-foreground',
    'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_rgba(0,0,0,0.2)]',
    'border-l-[3px] border-l-white/70',
);

export const sidebarSubLinkBase = cn(
    'h-9 gap-3 rounded-lg px-3 py-2 text-[13px] font-medium',
    'text-sidebar-foreground/75 hover:bg-white/[0.08] hover:text-sidebar-foreground',
    'transition-all duration-150',
);

export const sidebarSubLinkActive = cn(
    'bg-white/[0.13] text-sidebar-foreground',
    'shadow-sm',
);

export const sidebarParentOpen = cn(
    'bg-white/[0.07] text-sidebar-foreground',
    'ring-1 ring-inset ring-white/[0.08]',
);

export const sidebarParentActive = cn(
    sidebarLinkActive,
    'data-[state=open]:bg-white/[0.16]',
);
