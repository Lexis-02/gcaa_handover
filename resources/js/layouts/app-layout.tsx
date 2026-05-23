import { FlashAlerts } from '@/components/flash-alerts';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { BreadcrumbItem } from '@/types';

export default function AppLayout({
    title,
    breadcrumbs = [],
    children,
}: {
    title?: string;
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    const pageTitle =
        title ?? breadcrumbs[breadcrumbs.length - 1]?.title ?? '';

    return (
        <AppLayoutTemplate pageTitle={pageTitle}>
            <FlashAlerts />
            {children}
        </AppLayoutTemplate>
    );
}
