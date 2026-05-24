import { Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { isNavChildActive } from '@/lib/nav-active';
import {
    dropdownChild,
    dropdownPanel,
    springSnappy,
} from '@/lib/motion';
import {
    sidebarLinkBase,
    sidebarParentActive,
    sidebarParentOpen,
    sidebarSubLinkActive,
    sidebarSubLinkBase,
} from '@/lib/sidebar-nav-styles';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types';

type NavCollapsibleItemProps = {
    item: NavItem;
};

type FlyoutPosition = {
    top: number;
    left: number;
};

function CollapsedNavFlyout({
    item,
    subItems,
    open,
    position,
    flyoutRef,
}: {
    item: NavItem;
    subItems: NonNullable<NavItem['children']>;
    open: boolean;
    position: FlyoutPosition;
    flyoutRef: React.RefObject<HTMLDivElement | null>;
}) {
    const { currentUrl } = useCurrentUrl();

    if (!open || typeof document === 'undefined') {
        return null;
    }

    return createPortal(
        <motion.div
            ref={flyoutRef}
            role="menu"
            aria-label={item.title}
            initial={{ opacity: 0, x: -8, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
            style={{
                position: 'fixed',
                top: position.top,
                left: position.left,
                zIndex: 100,
            }}
            className={cn(
                'min-w-[13.5rem] rounded-xl border border-white/[0.12]',
                'bg-sidebar/95 backdrop-blur-md p-2 text-sidebar-foreground',
                'shadow-[0_8px_32px_rgba(0,0,0,0.35),0_2px_8px_rgba(0,0,0,0.2)]',
            )}
        >
            {/* Section header */}
            <div className="mb-1.5 flex items-center gap-2 px-3 py-1.5">
                {item.icon && <item.icon className="size-3.5 shrink-0 opacity-60" />}
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-sidebar-foreground/50">
                    {item.title}
                </p>
            </div>
            {/* Divider */}
            <div className="mb-1.5 mx-2 h-px bg-white/[0.08]" />
            <ul className="flex min-w-0 flex-col gap-0.5">
                {subItems.map((child, index) => {
                    const ChildIcon = child.icon;
                    const active = isNavChildActive(child, currentUrl);

                    return (
                        <motion.li
                            key={child.title}
                            custom={index}
                            variants={dropdownChild}
                            initial="closed"
                            animate="open"
                            exit="closed"
                        >
                            <Link
                                href={child.href}
                                prefetch
                                className={cn(
                                    'group/flyitem relative flex h-9 items-center gap-2.5 rounded-lg px-3 text-sm font-medium transition-all duration-150',
                                    active
                                        ? 'bg-white/[0.14] text-sidebar-foreground shadow-sm'
                                        : 'text-sidebar-foreground/75 hover:bg-white/[0.08] hover:text-sidebar-foreground',
                                )}
                            >
                                {/* Active indicator dot */}
                                {active && (
                                    <span className="absolute left-1 top-1/2 -translate-y-1/2 size-1.5 rounded-full bg-white/80" />
                                )}
                                {ChildIcon && (
                                    <ChildIcon className={cn('size-3.5 shrink-0 transition-opacity', active ? 'opacity-90' : 'opacity-60 group-hover/flyitem:opacity-80')} />
                                )}
                                <span className="truncate">{child.title}</span>
                            </Link>
                        </motion.li>
                    );
                })}
            </ul>
        </motion.div>,
        document.body,
    );
}

export function NavCollapsibleItem({ item }: NavCollapsibleItemProps) {
    const { currentUrl } = useCurrentUrl();
    const { state, isMobile } = useSidebar();
    const collapsed = state === 'collapsed' && !isMobile;
    const children = item.children ?? [];
    const childActive = children.some((child) =>
        isNavChildActive(child, currentUrl),
    );
    const [open, setOpen] = useState(childActive);
    const [flyoutPosition, setFlyoutPosition] = useState<FlyoutPosition>({
        top: 0,
        left: 0,
    });
    const triggerRef = useRef<HTMLButtonElement>(null);
    const flyoutRef = useRef<HTMLDivElement>(null);
    const Icon = item.icon;

    const updateFlyoutPosition = () => {
        if (!triggerRef.current) {
            return;
        }

        const rect = triggerRef.current.getBoundingClientRect();
        setFlyoutPosition({
            top: rect.top,
            left: rect.right + 8,
        });
    };

    useLayoutEffect(() => {
        if (!collapsed || !open) {
            return;
        }

        updateFlyoutPosition();

        window.addEventListener('resize', updateFlyoutPosition);
        window.addEventListener('scroll', updateFlyoutPosition, true);

        return () => {
            window.removeEventListener('resize', updateFlyoutPosition);
            window.removeEventListener('scroll', updateFlyoutPosition, true);
        };
    }, [collapsed, open]);

    useEffect(() => {
        if (!collapsed || !open) {
            return;
        }

        const handlePointerDown = (event: MouseEvent) => {
            const target = event.target as Node;
            if (
                flyoutRef.current?.contains(target) ||
                triggerRef.current?.contains(target)
            ) {
                return;
            }
            setOpen(false);
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handlePointerDown);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handlePointerDown);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [collapsed, open]);

    return (
        <SidebarMenuItem>
            <Collapsible open={open} onOpenChange={setOpen}>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                        ref={triggerRef}
                        tooltip={
                            collapsed && !open
                                ? { children: item.title }
                                : undefined
                        }
                        className={cn(
                            sidebarLinkBase,
                            open && !childActive && sidebarParentOpen,
                            childActive && sidebarParentActive,
                            'group/trigger',
                        )}
                    >
                        {Icon && (
                            <Icon className={cn(
                                'size-[17px] shrink-0 transition-all duration-150',
                                (open || childActive) ? 'opacity-100' : 'opacity-70 group-hover/trigger:opacity-90',
                            )} />
                        )}
                        {!collapsed && (
                            <>
                                <span className="flex-1 truncate text-left">
                                    {item.title}
                                </span>
                                <motion.span
                                    animate={{ rotate: open ? 180 : 0 }}
                                    transition={springSnappy}
                                    className={cn(
                                        'ml-auto flex size-5 shrink-0 items-center justify-center rounded-md transition-colors duration-150',
                                        open ? 'bg-white/[0.1]' : 'group-hover/trigger:bg-white/[0.06]',
                                    )}
                                >
                                    <ChevronRight className={cn(
                                        'size-3.5 transition-opacity duration-150',
                                        open ? 'opacity-80 rotate-90' : 'opacity-40 group-hover/trigger:opacity-60',
                                    )} style={{ transform: undefined }} />
                                </motion.span>
                            </>
                        )}
                    </SidebarMenuButton>
                </CollapsibleTrigger>

                {collapsed ? (
                    <AnimatePresence>
                        {open && (
                            <CollapsedNavFlyout
                                item={item}
                                subItems={children}
                                open={open}
                                position={flyoutPosition}
                                flyoutRef={flyoutRef}
                            />
                        )}
                    </AnimatePresence>
                ) : (
                    <AnimatePresence initial={false}>
                        {open && (
                            <CollapsibleContent forceMount asChild>
                                <motion.div
                                    key="submenu"
                                    variants={dropdownPanel}
                                    initial="closed"
                                    animate="open"
                                    exit="closed"
                                    className="overflow-hidden"
                                >
                                    <SidebarMenuSub className="mx-0 gap-0.5 border-none px-0 py-2">
                                        {/* Left accent rail with subtle glass bg */}
                                        <div className="relative ml-4 rounded-lg bg-white/[0.04] px-0 py-1">
                                            {/* Vertical accent line */}
                                            <div className="absolute left-3 top-1 bottom-1 w-px bg-white/[0.12]" />
                                            {children.map((child, index) => {
                                                const ChildIcon = child.icon;
                                                const active = isNavChildActive(
                                                    child,
                                                    currentUrl,
                                                );

                                                return (
                                                    <SidebarMenuSubItem
                                                        key={child.title}
                                                    >
                                                        <motion.div
                                                            custom={index}
                                                            variants={dropdownChild}
                                                            initial="closed"
                                                            animate="open"
                                                            exit="closed"
                                                        >
                                                            <SidebarMenuSubButton
                                                                asChild
                                                                isActive={active}
                                                                className={cn(
                                                                    'group/subitem relative h-9 rounded-lg pl-7 pr-3 text-[13.5px] font-medium transition-all duration-150',
                                                                    active
                                                                        ? 'bg-white/[0.13] text-sidebar-foreground shadow-sm'
                                                                        : 'text-sidebar-foreground/70 hover:bg-white/[0.08] hover:text-sidebar-foreground',
                                                                )}
                                                            >
                                                                <Link
                                                                    href={child.href}
                                                                    prefetch
                                                                >
                                                                    {/* Active dot on the rail */}
                                                                    {active && (
                                                                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 size-1.5 rounded-full bg-white/80" />
                                                                    )}
                                                                    {ChildIcon && (
                                                                        <ChildIcon className={cn(
                                                                            'size-3.5 shrink-0 transition-opacity',
                                                                            active ? 'opacity-90' : 'opacity-55 group-hover/subitem:opacity-80',
                                                                        )} />
                                                                    )}
                                                                    <span className="truncate">
                                                                        {child.title}
                                                                    </span>
                                                                </Link>
                                                            </SidebarMenuSubButton>
                                                        </motion.div>
                                                    </SidebarMenuSubItem>
                                                );
                                            })}
                                        </div>
                                    </SidebarMenuSub>
                                </motion.div>
                            </CollapsibleContent>
                        )}
                    </AnimatePresence>
                )}
            </Collapsible>
        </SidebarMenuItem>
    );
}
