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
import { dropdownChild, dropdownPanel, springSnappy } from '@/lib/motion';
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
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
            style={{
                position: 'fixed',
                top: position.top,
                left: position.left,
                zIndex: 100,
            }}
            className={cn(
                'min-w-[12.5rem] rounded-lg border border-white/10',
                'bg-sidebar p-3 text-sidebar-foreground shadow-xl',
            )}
        >
            <p className="mb-2 px-2 text-xs font-semibold tracking-wide text-sidebar-foreground/70 uppercase">
                {item.title}
            </p>
            <ul className="flex min-w-0 flex-col gap-1 border-l border-white/10 pl-3">
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
                                    'flex h-8 items-center gap-2 rounded-md px-2 text-sm',
                                    sidebarSubLinkBase,
                                    active && sidebarSubLinkActive,
                                )}
                            >
                                {ChildIcon && (
                                    <ChildIcon className="size-4 shrink-0 opacity-80" />
                                )}
                                <span>{child.title}</span>
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
                        )}
                    >
                        {Icon && <Icon className="size-[18px] shrink-0" />}
                        {!collapsed && (
                            <>
                                <span className="flex-1 truncate text-left">
                                    {item.title}
                                </span>
                                <motion.span
                                    animate={{ rotate: open ? 90 : 0 }}
                                    transition={springSnappy}
                                    className="ml-auto shrink-0"
                                >
                                    <ChevronRight className="size-4 opacity-60" />
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
                                    <SidebarMenuSub className="mx-0 gap-1.5 border-l border-white/10 px-3 py-2.5 pl-5">
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
                                                                sidebarSubLinkBase,
                                                                active &&
                                                                    sidebarSubLinkActive,
                                                            )}
                                                        >
                                                            <Link
                                                                href={
                                                                    child.href
                                                                }
                                                                prefetch
                                                            >
                                                                {ChildIcon && (
                                                                    <ChildIcon className="size-4 shrink-0 opacity-80" />
                                                                )}
                                                                <span>
                                                                    {
                                                                        child.title
                                                                    }
                                                                </span>
                                                            </Link>
                                                        </SidebarMenuSubButton>
                                                    </motion.div>
                                                </SidebarMenuSubItem>
                                            );
                                        })}
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
