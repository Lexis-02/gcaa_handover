import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { NavCollapsibleItem } from '@/components/nav-collapsible-item';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { sidebarItem, sidebarList } from '@/lib/motion';
import {
    sidebarLinkActive,
    sidebarLinkBase,
} from '@/lib/sidebar-nav-styles';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="gap-2 px-3 py-4">
            <motion.div
                variants={sidebarList}
                initial="hidden"
                animate="visible"
            >
                <SidebarMenu className="gap-1.5">
                    {items.map((item) => {
                        if (item.children && item.children.length > 0) {
                            return (
                                <motion.div
                                    key={item.title}
                                    variants={sidebarItem}
                                >
                                    <NavCollapsibleItem item={item} />
                                </motion.div>
                            );
                        }

                        const Icon = item.icon;
                        const active = isCurrentUrl(item.href);

                        return (
                            <motion.div
                                key={item.title}
                                variants={sidebarItem}
                            >
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={active}
                                        tooltip={{ children: item.title }}
                                        className={cn(
                                            sidebarLinkBase,
                                            active && sidebarLinkActive,
                                        )}
                                    >
                                        <Link href={item.href} prefetch>
                                            {Icon && (
                                                <Icon className="size-[18px] shrink-0" />
                                            )}
                                            <span className="truncate">
                                                {item.title}
                                            </span>
                                            {item.badge && (
                                                <Badge className="ml-auto border-0 bg-white/15 text-sidebar-foreground">
                                                    {item.badge}
                                                </Badge>
                                            )}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </motion.div>
                        );
                    })}
                </SidebarMenu>
            </motion.div>
        </SidebarGroup>
    );
}
