import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { resolveNavIcon } from '@/lib/nav-icons';
import { dashboard } from '@/routes';
import type { NavItem, SharedNavItem } from '@/types';

function mapNavItems(items: SharedNavItem[]): NavItem[] {
    return items.map((item) => ({
        title: item.title,
        href: item.href,
        icon: resolveNavIcon(item.icon),
        badge: item.badge,
        children: item.children?.map((child) => ({
            title: child.title,
            href: child.href,
            icon: resolveNavIcon(child.icon),
            match: child.match,
        })),
    }));
}

export function AppSidebar() {
    const { navigation } = usePage().props;
    const mainNavItems = mapNavItems(navigation?.main ?? []);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader className="border-b border-sidebar-border px-3 py-5">
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                >
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                size="lg"
                                asChild
                                className="h-auto min-h-[3.25rem] px-3 py-3 hover:bg-white/[0.06]"
                            >
                                <Link href={dashboard()} prefetch>
                                    <AppLogo />
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </motion.div>
            </SidebarHeader>

            <SidebarContent className="custom-scrollbar overflow-x-visible overflow-y-auto">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border px-2 py-4">
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.12, ease: [0.4, 0, 0.2, 1] }}
                >
                    <NavUser />
                </motion.div>
            </SidebarFooter>
        </Sidebar>
    );
}
