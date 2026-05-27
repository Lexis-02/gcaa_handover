import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { resolveNavIcon } from '@/lib/nav-icons';
import { pageItem } from '@/lib/motion';
import type { DashboardQuickLink } from '@/types';

type DashboardQuickLinksProps = {
    links: DashboardQuickLink[];
};

export function DashboardQuickLinks({ links }: DashboardQuickLinksProps) {
    if (links.length === 0) {
        return null;
    }

    return (
        <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Quick links
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {links.map((link, index) => {
                    const Icon = resolveNavIcon(link.icon) ?? resolveNavIcon('layout-grid');

                    return (
                        <motion.div
                            key={link.href}
                            variants={pageItem}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Link
                                href={link.href}
                                className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4 shadow-sm"
                            >
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted/80 text-muted-foreground">
                                    {Icon && <Icon className="size-5" />}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-medium">{link.title}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {link.description}
                                    </p>
                                </div>
                                {link.badge != null && link.badge > 0 && (
                                    <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
                                        {link.badge > 9 ? '9+' : link.badge}
                                    </span>
                                )}
                            </Link>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
