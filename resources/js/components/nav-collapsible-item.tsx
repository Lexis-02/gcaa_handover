import { Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
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

export function NavCollapsibleItem({ item }: NavCollapsibleItemProps) {
    const { currentUrl } = useCurrentUrl();
    const children = item.children ?? [];
    const childActive = children.some((child) =>
        isNavChildActive(child, currentUrl),
    );
    const [open, setOpen] = useState(childActive);
    const Icon = item.icon;

    return (
        <SidebarMenuItem>
            <Collapsible open={open} onOpenChange={setOpen}>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                        tooltip={{ children: item.title }}
                        className={cn(
                            sidebarLinkBase,
                            open && !childActive && sidebarParentOpen,
                            childActive && sidebarParentActive,
                        )}
                    >
                        {Icon && <Icon className="size-[18px] shrink-0" />}
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
                    </SidebarMenuButton>
                </CollapsibleTrigger>
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
                                                            href={child.href}
                                                            prefetch
                                                        >
                                                            {ChildIcon && (
                                                                <ChildIcon className="size-4 shrink-0 opacity-80" />
                                                            )}
                                                            <span>
                                                                {child.title}
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
            </Collapsible>
        </SidebarMenuItem>
    );
}
